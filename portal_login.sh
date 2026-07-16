#!/bin/sh
# ============================================================
#  NJUPT Portal Auto Login — BusyBox Edition
# ============================================================
#  Requires: busybox (ash, wget, printf, sed, grep, cut, head)
#            ip or ifconfig (for local IP detection)
#
#  Setup:
#    1. Set PASSWORD and ACCOUNTS_FILE below
#    2. Create account file (one account per line, skip # and empty)
#    3. crontab:
#       * * * * * /path/to/login.sh >> /var/log/portal_login.log 2>&1
# ============================================================

# --- Config ------------------------------------------------
PASSWORD=""                                # set password here
ACCOUNTS_FILE="/path/to/accounts.txt"   # account list file
FORCE_IP=""                                # auto-detect if empty
HOST="p.njupt.edu.cn"
PORT_HTTPS=804
PORT_HTTP=803
B64="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

# --- Utils ------------------------------------------------
now()  { date '+%m-%d %H:%M:%S'; }
log()  { echo "$(now) $*"; }
rand() {
    _n=$(date +%s 2>/dev/null || echo 1)
    echo $(( (($$ * 1103515245 + 12345 + _n) & 0x7fffffff) % 9500 + 500 ))
}

# --- Base64 (pure shell, rfc2045) -----------------------
b64e() {
    _s="$1" _l=${#_s} _i=0 _o=""
    while [ $_i -lt $_l ]; do
        _b1=$(printf '%d' "'${_s:$_i:1}"); _i=$((_i+1))
        if [ $_i -ge $_l ]; then
            _o="${_o}${B64:$((_b1>>2)):1}${B64:$(((_b1&3)<<4)):1}=="
            break
        fi
        _b2=$(printf '%d' "'${_s:$_i:1}"); _i=$((_i+1))
        if [ $_i -ge $_l ]; then
            _o="${_o}${B64:$((_b1>>2)):1}${B64:$((((_b1&3)<<4)|(_b2>>4))):1}${B64:$(((_b2&15)<<2)):1}="
            break
        fi
        _b3=$(printf '%d' "'${_s:$_i:1}"); _i=$((_i+1))
        _o="${_o}${B64:$((_b1>>2)):1}${B64:$((((_b1&3)<<4)|(_b2>>4))):1}${B64:$((((_b2&15)<<2)|(_b3>>6))):1}${B64:$((_b3&63)):1}"
    done
    echo "$_o"
}

# --- XOR cipher -------------------------------------------
getkey() {
    _s="$1" _k=0 _i=0 _l=${#_s}
    while [ $_i -lt $_l ]; do
        _k=$(( _k ^ $(printf '%d' "'${_s:$_i:1}") ))
        _i=$((_i+1))
    done
    echo $((_k & 255))
}

enc_pwd() {
    _s="$1" _k="$2" _i=0 _l=${#_s} _o=""
    [ "$_l" -eq 0 ] && return
    while [ $_i -lt $_l ]; do
        _v=$(( $(printf '%d' "'${_s:$_i:1}") ^ _k ))
        _o="${_o}$(printf '%02x' $_v)"
        _i=$((_i+1))
    done
    echo "$_o"
}

# --- HTTP -------------------------------------------------
# Falls back to HTTP if busybox wget lacks SSL support
http_get() {
    _url="$1"
    wget -qO- -T 10 "$_url" 2>/dev/null && return 0
    # downgrade: https://host:804 → http://host:803
    _http=$(echo "$_url" | sed "s|https://${HOST}:${PORT_HTTPS}|http://${HOST}:${PORT_HTTP}|")
    wget -qO- -T 10 "$_http" 2>/dev/null
}

# --- Connectivity check -----------------------------------
check_net() {
    # fetch baidu — if portal redirect detected, net is blocked
    log "checking internet connectivity..."
    _r=$(http_get "https://www.baidu.com" 2>/dev/null | head -c 200)
    if [ -z "$_r" ]; then
        log "  OFFLINE no response from baidu"
        return 1
    fi
    case "$_r" in
        *eportal*|*njupt*|*portal*)
            log "  OFFLINE portal redirect detected"
            return 1 ;;
        *)
            log "  ONLINE internet reachable, skipping login"
            return 0 ;;
    esac
}

# --- IP detection -----------------------------------------
get_ip() {
    [ -n "$FORCE_IP" ] && { echo "$FORCE_IP"; return 0; }

    # ip addr (prefer tun interfaces)
    if command -v ip >/dev/null 2>&1; then
        for _if in utun tun0 singtun; do
            _line=$(ip -4 -o addr show dev "$_if" 2>/dev/null | head -1)
            [ -z "$_line" ] && continue
            _line=${_line##*inet }; _ip=${_line%%/*}
            case "$_ip" in 127.*|'') continue ;; esac
            echo "$_ip"; return 0
        done
        # fallback: any non-lo / non-docker private IP
        _line=$(ip -4 -o addr show 2>/dev/null | grep -v ' lo \|docker\|br-' | head -1)
        _line=${_line##*inet }; _ip=${_line%%/*}
        case "$_ip" in 127.*|172.17.*|'') ;; *) echo "$_ip"; return 0 ;; esac
    fi

    # ifconfig (macOS / old Linux)
    if command -v ifconfig >/dev/null 2>&1; then
        _line=$(ifconfig 2>/dev/null | grep 'inet ' | grep -v '127.0.0.1' | head -1)
        _line=${_line##*inet }; _ip=${_line%% *}; _ip=${_ip#addr:}
        case "$_ip" in 127.*|172.17.*|'') ;; *) echo "$_ip"; return 0 ;; esac
    fi

    return 1
}

# --- Portal config ----------------------------------------
get_config() {
    _ip="$1"
    _qs="program_index=&wlan_vlan_id=0&wlan_user_ip=$(b64e "$_ip")"
    _qs="${_qs}&wlan_user_ipv6=&wlan_user_ssid=&wlan_user_areaid="
    _qs="${_qs}&wlan_ac_ip=$(b64e '')&wlan_ap_mac=000000000000"
    _qs="${_qs}&gw_id=000000000000"
    _qs="${_qs}&callback=dr_cfg&v=$(rand)&lang=zh"
    _url="https://${HOST}:${PORT_HTTPS}/eportal/portal/page/loadConfig?${_qs}"

    _r=$(http_get "$_url")
    [ -z "$_r" ] && { echo "|||"; return; }

    # extract JSON fields with sed (no jq needed)
    _pi=$(echo "$_r" | sed -n 's/.*"program_index":"\([^"]*\)".*/\1/p' | head -1)
    _pg=$(echo "$_r" | sed -n 's/.*"page_index":"\([^"]*\)".*/\1/p' | head -1)
    _rc=$(echo "$_r" | sed -n 's/.*"rcn":"\([^"]*\)".*/\1/p' | head -1)
    _lm=$(echo "$_r" | sed -n 's/.*"login_method":"\([^"]*\)".*/\1/p' | head -1)
    echo "${_pi}|${_pg}|${_rc}|${_lm}"
}

# --- One login attempt ------------------------------------
# args: account password ip config(pi|pg|rc|lm)
# exit: 0=ok 1=fail, failure reason on stderr
try_login() {
    _acct="$1" _pwd="$2" _ip="$3" _cfg="$4"

    # parse config
    _pi="${_cfg%%|*}"; _rest="${_cfg#*|}"
    _pg="${_rest%%|*}"; _rest="${_rest#*|}"
    _rc="${_rest%%|*}"; _lm="${_rest##*|}"
    [ -z "$_lm" ] && _lm=1

    # prepend ",0," if not already present
    case "$_acct" in *,*) ;; *) _acct=",0,${_acct}" ;; esac

    _key=$(getkey "$_ip")
    _cb="dr$(rand)$(rand)"
    _ua="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    _b64ua=$(b64e "$_ua")
    _b64acct=$(b64e "$_acct")
    _b64pwd=$(b64e "$_pwd")

    # build encrypted params
    set -- \
        "callback"        "$_cb"              0 \
        "login_method"    "$_lm"              0 \
        "is_base64encode" "1"                 0 \
        "user_account"    "$_b64acct"         0 \
        "user_password"   "$_b64pwd"          0 \
        "wlan_user_ip"    "$_ip"              0 \
        "wlan_user_ipv6"  ""                  0 \
        "wlan_user_mac"   "000000000000"      0 \
        "wlan_vlan_id"    "0"                 0 \
        "wlan_ac_ip"      ""                  0 \
        "wlan_ac_name"    ""                  0 \
        "authex_enable"   ""                  0 \
        "jsVersion"       "4.5"               0 \
        "terminal_type"   "1"                 0 \
        "lang"            "zh-cn"             0 \
        "user_agent"      "$_b64ua"           0 \
        "enable_r3"       "0"                 0 \
        "mac_type"        "0"                 0 \
        "rcn"             "$_rc"              0 \
        "operate"         "portal_login"      0 \
        "business_type"   "1"                 0 \
        "program_index"   "$_pi"              0 \
        "page_index"      "$_pg"              0

    _params=""
    while [ $# -ge 3 ]; do
        _name="$1" _val="$2"; shift 3
        _enc=$(enc_pwd "$_val" $_key)
        _params="${_params}&${_name}=${_enc}"
    done

    _params="${_params}&encrypt=1&v=$(rand)&lang=zh"
    _url="https://${HOST}:${PORT_HTTPS}/eportal/portal/login?${_params#&}"

    _r=$(http_get "$_url")
    [ -z "$_r" ] && { echo "no response" >&2; return 1; }

    # check result
    if echo "$_r" | grep -qE '"result":1|"result":"ok"'; then
        return 0
    fi

    _msg=$(echo "$_r" | sed -n 's/.*"msg":"\([^"]*\)".*/\1/p' | head -1)
    _ret=$(echo "$_r" | sed -n 's/.*"ret_code":"\([^"]*\)".*/\1/p' | head -1)
    echo "${_msg:-${_ret:-unknown}}" >&2
    return 1
}

# --- Main -------------------------------------------------
main() {
    if check_net; then
        return 0
    fi

    _ip=$(get_ip)
    if [ -z "$_ip" ]; then
        log "ERROR cannot detect IP"
        return 1
    fi
    log "IP=$_ip key=$(getkey "$_ip")"

    _cfg=$(get_config "$_ip")
    log "CFG $(echo "$_cfg" | tr '|' ' ')"

    _total=0 _i=0 _ok=0
    for _acc in $(grep -v '^#' "$ACCOUNTS_FILE" | grep -v '^$' | cut -d' ' -f1); do
        _total=$((_total+1))
    done
    [ "$_total" -eq 0 ] && { log "ERROR account list is empty"; return 1; }

    for _acc in $(grep -v '^#' "$ACCOUNTS_FILE" | grep -v '^$' | cut -d' ' -f1); do
        _i=$((_i+1))
        _short=$(echo "$_acc" | cut -c1-4)
        log "[${_i}/${_total}] trying ${_short}***"

        _err=$(try_login "$_acc" "$PASSWORD" "$_ip" "$_cfg" 2>&1)
        if [ $? -eq 0 ]; then
            log "  OK login success: $_acc"
            _ok=1
            break
        fi
        log "  FAIL ${_err:-request failed}"
    done

    [ "$_ok" -eq 0 ] && log "ERROR all ${_total} accounts failed"
    return 0
}

[ -z "$PASSWORD" ] && { echo "$(now) ERROR PASSWORD not set, edit script"; exit 1; }
main
