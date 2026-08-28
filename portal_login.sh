#!/bin/sh
# ============================================================
#  NJUPT Portal Auto Login — BusyBox Edition (plaintext 802)
# ============================================================
#  Requires: busybox (ash, wget, printf, sed, grep, cut, head)
#            ip or ifconfig (for local IP detection)
#
#  当前 portal 协议 (v2026-08-21): 认证 API 在 802 端口(HTTPS),
#  登录走明文 JSONP(GET), 字段: callback/user_account/user_password/
#  wlan_user_ip/wlan_user_mac/terminal_type/lang/jsVersion.
#  注意: 用户密码含特殊字符(如 +)需 URL 编码.
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
PORT_HTTPS=802
PORT_HTTP=803
B64="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

# --- Utils ------------------------------------------------
now()  { date '+%m-%d %H:%M:%S'; }
log()  { echo "$(now) $*"; }
rand() {
    _n=$(date +%s 2>/dev/null || echo 1)
    echo $(( (($$ * 1103515245 + 12345 + _n) & 0x7fffffff) % 9500 + 500 ))
}

# --- URL-encode a query component (for password with special chars) ---
url_enc() {   # $1=raw -> percent-encoded
    printf '%s' "$1" | sed 's/+/%2B/g; s/\//%2F/g; s/=/%3D/g; s/&/%26/g; s/ /%20/g'
}

# --- Base64 (pure shell) — 用于 loadConfig 的 wlan_user_ip ---
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

# --- AES-ECB (openssl) — portal AES 协议(AES 版)用 ---
AES_KEY_HEX="35433164356164346465613065386464"   # hex('5C1d5ad4dea0e8dd') = apg_page_secret
aes_enc() {   # $1=plaintext → base64 (AES-128-ECB, PKCS7)
    printf '%s' "$1" | openssl enc -aes-128-ecb -K "$AES_KEY_HEX" -nosalt 2>/dev/null \
        | openssl base64 -A 2>/dev/null
}
json_esc() {  # $1=raw -> escaped (stdout, no quotes), 用于 JSON 字符串
    _s=$1 _o="" _i=0 _l=${#_s}
    while [ $_i -lt $_l ]; do
        _c=${_s:$_i:1}
        case "$_c" in
            '"') _o="${_o}\\\"" ;;
            '\\') _o="${_o}\\\\" ;;
            *)   _o="${_o}${_c}" ;;
        esac
        _i=$((_i+1))
    done
    printf '%s' "$_o"
}

# --- HTTP -------------------------------------------------
# Falls back to HTTP if busybox wget lacks SSL support
http_get() {
    _url="$1"
    wget -qO- -T 10 "$_url" 2>/dev/null && return 0
    # downgrade: https://host:802 → http://host:803
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

# --- Portal config (协议探测) ---------------------------------
# loadConfig 有 rcn 字段 → AES 协议(apg_page_secret); 无 rcn → 明文协议.
# 输出: pi|pg|rc (rc 为空表示明文协议)
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

    _pi=$(echo "$_r" | sed -n 's/.*"program_index":"\([^"]*\)".*/\1/p' | head -1)
    _pg=$(echo "$_r" | sed -n 's/.*"page_index":"\([^"]*\)".*/\1/p' | head -1)
    _rc=$(echo "$_r" | sed -n 's/.*"rcn":"\([^"]*\)".*/\1/p' | head -1)
    echo "${_pi}|${_pg}|${_rc}"
}

# --- One login attempt ------------------------------------
# args: account password ip config(pi|pg|rc)
# exit: 0=ok 1=fail, failure reason on stderr
# 双协议自适应: rc 非空 → AES(apg_page_secret); rc 空 → 明文 JSONP.
try_login() {
    _acct="$1" _pwd="$2" _ip="$3" _cfg="$4"

    _pi="${_cfg%%|*}"; _rest="${_cfg#*|}"
    _pg="${_rest%%|*}"; _rc="${_rest#*|}"

    # prepend ",0," if not already present (运营商账号前缀)
    case "$_acct" in *,*) ;; *) _acct=",0,${_acct}" ;; esac

    _cb="dr$(rand)$(rand)"

    if [ -n "$_rc" ]; then
        # ---- AES 协议 (apg_page_secret, params=整体AES) ----
        _ua="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0"
        _at=$(date +%s 2>/dev/null || echo 0)
        _j=""
        _j="${_j}\"apgTime\":${_at}000"
        _j="${_j},\"callback\":\"$(json_esc "$_cb")\""
        _j="${_j},\"login_method\":\"1\""
        _j="${_j},\"is_base64encode\":\"0\""
        _j="${_j},\"user_account\":\"$(json_esc "$_acct")\""
        _j="${_j},\"user_password\":\"$(json_esc "$_pwd")\""
        _j="${_j},\"wlan_user_ip\":\"$(json_esc "$_ip")\""
        _j="${_j},\"wlan_user_ipv6\":\"\""
        _j="${_j},\"wlan_user_mac\":\"000000000000\""
        _j="${_j},\"wlan_vlan_id\":\"0\""
        _j="${_j},\"wlan_ac_ip\":\"\""
        _j="${_j},\"wlan_ac_name\":\"\""
        _j="${_j},\"authex_enable\":\"\""
        _j="${_j},\"jsVersion\":\"4.5\""
        _j="${_j},\"terminal_type\":\"1\""
        _j="${_j},\"lang\":\"zh-cn\""
        _j="${_j},\"user_agent\":\"$(json_esc "$_ua")\""
        _j="${_j},\"enable_r3\":\"0\""
        _j="${_j},\"mac_type\":\"0\""
        _j="${_j},\"rcn\":\"$(json_esc "$_rc")\""
        _j="${_j},\"operate\":\"portal_login\""
        _j="${_j},\"business_type\":\"1\""
        _j="${_j},\"program_index\":\"$(json_esc "$_pi")\""
        _j="${_j},\"page_index\":\"$(json_esc "$_pg")\""
        _j="{$_j}"
        _params=$(aes_enc "$_j")
        [ -z "$_params" ] && { echo "aes failed" >&2; return 1; }
        _params=$(url_enc "$_params")
        _url="https://${HOST}:${PORT_HTTPS}/eportal/portal/login?callback=${_cb}&jsVersion=4.X&params=${_params}"
    else
        # ---- 明文协议 (8 字段 JSONP GET) ----
        _pwd_q=$(url_enc "$_pwd")
        _url="https://${HOST}:${PORT_HTTPS}/eportal/portal/login?callback=${_cb}"
        _url="${_url}&user_account=${_acct}&user_password=${_pwd_q}"
        _url="${_url}&wlan_user_ip=${_ip}&wlan_user_mac=000000000000"
        _url="${_url}&terminal_type=1&lang=zh-cn&jsVersion=4.1.3"
    fi

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
    log "IP=$_ip"

    _cfg=$(get_config "$_ip")
    case "$_cfg" in
        \|\|\|) log "ERROR loadConfig failed"; return 1 ;;
    esac
    _rc="${_cfg##*|}"
    if [ -n "$_rc" ]; then
        log "PROTOCOL aes(rcn=$_rc)"
    else
        log "PROTOCOL plaintext"
    fi

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
