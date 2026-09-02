#!/bin/sh
# ============================================================
#  NJUPT Portal Auto Login — POSIX sh / BusyBox (dual-protocol)
# ============================================================
#  Requires: sh, curl 或 wget, openssl, sed/grep/head/cut/date/printf,
#            OpenWrt 的 ubus/jsonfilter，或 ip/ifconfig
#
#  协议: portal 在 AES(apg_page_secret, rcn 存在) 与明文 JSONP(无 rcn)
#        之间切换, 脚本启动时经 loadConfig 探测, 自动选择.
#
#  代理环境注意事项:
#    - 域名 p.njupt.edu.cn 解析到内网 IP, 若代理(fake-ip/DNS劫持)干扰,
#      请在 /etc/hosts 钉死: 10.10.244.11  p.njupt.edu.cn
#    - 到内网 IP 的流量需被代理放行(私有 IP 直连)
#    - 或显式设置 HOST_IP=10.10.244.11 绕过 DNS
#
#  Setup:
#    1. Set PASSWORD and ACCOUNTS_FILE below (必填)
#    2. Create account file (one account per line, skip # and empty)
#    3. crontab:
#       * * * * * /path/to/login.sh >> /var/log/portal_login.log 2>&1
# ============================================================

# --- 显式配置 (必填/可选) -----------------------------------
PASSWORD=""                                # 必填: 账号密码
ACCOUNTS_FILE="/path/to.accounts.txt"      # 必填: 账号列表文件
FORCE_IP=""                                # 可选: 强制指定登录 IP, 空=自动检测
HOST="p.njupt.edu.cn"                      # portal 域名
HOST_IP=""                                 # 可选: portal 直连 IP(绕过DNS), 空=用 HOST
PORT_HTTPS=802                             # 认证 API HTTPS 端口
PORT_HTTP=803                              # 降级 HTTP 端口
HTTP_CLIENT=""                             # 可选: 显式 "curl" 或 "wget"; 空=自动检测(优先curl)
OPENWRT_INTERFACE="wan"                    # OpenWrt 上联网的逻辑接口名，例如 wan/wwan/eth0.x
AES_KEY_HEX="35433164356164346465613065386464"   # apg_page_secret 的 hex('5C1d5ad4dea0e8dd')

# 解析用主机 (HOST_IP 优先, 绕过 DNS)
_PORTAL_HOST="${HOST_IP:-$HOST}"

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

# --- Base64 — 用于 loadConfig 的 wlan_user_ip ----------------
# openssl 已是 AES 协议的必需依赖；复用它可避免非 POSIX 的字符串切片，
# 从而同时兼容 BusyBox ash、dash 和 bash。
b64e() {
    _out=$(printf '%s' "$1" | openssl base64 -A 2>/dev/null) \
        || { echo "ERROR b64e: openssl base64 失败" >&2; return 1; }
    printf '%s\n' "$_out"
}

# --- AES-ECB (openssl) — portal AES 协议用 ---
aes_enc() {   # $1=plaintext → base64 (AES-128-ECB, PKCS7); 失败时 stderr + return 1
    _plain="$1"
    [ -n "$_plain" ] || { echo "ERROR aes_enc: 空输入" >&2; return 1; }
    _out=$(printf '%s' "$_plain" | openssl enc -aes-128-ecb -K "$AES_KEY_HEX" -nosalt 2>/dev/null \
        | openssl base64 -A 2>/dev/null)
    [ -n "$_out" ] || { echo "ERROR aes_enc: openssl 加密失败 (检查 openssl 可用性)" >&2; return 1; }
    echo "$_out"
    return 0
}
json_esc() {  # $1=raw -> escaped (stdout, no quotes), 用于 JSON 字符串
    printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

# --- 依赖检测 (缺失即明确报错退出, 不静默) ------------------
check_deps() {
    _err=""
    # HTTP 客户端
    if [ -n "$HTTP_CLIENT" ]; then
        command -v "$HTTP_CLIENT" >/dev/null 2>&1 || _err="${_err} HTTP_CLIENT=$HTTP_CLIENT 不存在"
    else
        if command -v curl >/dev/null 2>&1; then HTTP_CLIENT=curl
        elif command -v wget >/dev/null 2>&1; then HTTP_CLIENT=wget
        else _err="${_err} 无可用 HTTP 客户端 (需 curl 或 wget, 或显式设置 HTTP_CLIENT)"
        fi
    fi
    # openssl (AES 协议必需; 当前 NJUPT 即 AES)
    command -v openssl >/dev/null 2>&1 || _err="${_err} 缺 openssl (AES 协议必需)"
    # IP 检测工具
    command -v ip >/dev/null 2>&1 || command -v ifconfig >/dev/null 2>&1 \
        || _err="${_err} 缺 ip/ifconfig (IP 检测必需)"
    # 基础工具
    for _t in sed grep head cut date printf; do
        command -v "$_t" >/dev/null 2>&1 || _err="${_err} 缺 $_t"
    done

    if [ -n "$_err" ]; then
        echo "$(now) ERROR 依赖检测失败:${_err}" >&2
        return 1
    fi
    log "DEPS ok (http=$HTTP_CLIENT)"
    return 0
}

# --- HTTP -------------------------------------------------
# 按 HTTP_CLIENT 请求; https 失败降级 http; 失败时明确 stderr
http_get() {
    _url="$1"
    case "$HTTP_CLIENT" in
        curl) _r=$(curl -sk --max-time 10 "$_url" 2>/dev/null) ;;
        wget) _r=$(wget -qO- -T 10 "$_url" 2>/dev/null) ;;
        *) echo "ERROR http_get: HTTP_CLIENT 未设置" >&2; return 1 ;;
    esac
    if [ -z "$_r" ]; then
        # 降级 https → http (仅对 portal 域名)
        _http=$(echo "$_url" | sed "s|https://${_PORTAL_HOST}:${PORT_HTTPS}|http://${_PORTAL_HOST}:${PORT_HTTP}|")
        if [ "$_http" != "$_url" ]; then
            case "$HTTP_CLIENT" in
                curl) _r=$(curl -sk --max-time 10 "$_http" 2>/dev/null) ;;
                wget) _r=$(wget -qO- -T 10 "$_http" 2>/dev/null) ;;
            esac
        fi
    fi
    if [ -z "$_r" ]; then
        echo "ERROR http_get 失败(含降级): ${_url%%\?*}" >&2
        return 1
    fi
    echo "$_r"
    return 0
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

    # OpenWrt: 优先读取 netifd 的上联逻辑接口，避免误取 br-lan 的
    # 192.168.1.1。ubus/jsonfilter 都是 OpenWrt 基础组件。
    if command -v ubus >/dev/null 2>&1 && command -v jsonfilter >/dev/null 2>&1; then
        _ip=$(ubus call "network.interface.${OPENWRT_INTERFACE}" status 2>/dev/null \
            | jsonfilter -e '@["ipv4-address"][0].address' 2>/dev/null \
            | head -1)
        case "$_ip" in 127.*|'') ;; *) echo "$_ip"; return 0 ;; esac
    fi

    # Linux/OpenWrt fallback: 默认路由对应网卡的 IPv4 地址
    if command -v ip >/dev/null 2>&1; then
        _line=$(ip -4 route show default 2>/dev/null | head -1)
        _dev=${_line##* dev }; _dev=${_dev%% *}
        if [ -n "$_dev" ] && [ "$_dev" != "$_line" ]; then
            _line=$(ip -4 -o addr show dev "$_dev" 2>/dev/null | head -1)
            _line=${_line##*inet }; _ip=${_line%%/*}
            case "$_ip" in 127.*|'') ;; *) echo "$_ip"; return 0 ;; esac
        fi

        # VPN 场景兼容
        for _if in utun tun0 singtun; do
            _line=$(ip -4 -o addr show dev "$_if" 2>/dev/null | head -1)
            [ -z "$_line" ] && continue
            _line=${_line##*inet }; _ip=${_line%%/*}
            case "$_ip" in 127.*|'') continue ;; esac
            echo "$_ip"; return 0
        done
        # 最后才选择任意非 LAN/容器地址
        _line=$(ip -4 -o addr show 2>/dev/null | grep -v ' lo \|docker\|br-\|br-lan' | head -1)
        _line=${_line##*inet }; _ip=${_line%%/*}
        case "$_ip" in 127.*|172.17.*|'') ;; *) echo "$_ip"; return 0 ;; esac
    fi

    # ifconfig (macOS / old Linux)
    if command -v ifconfig >/dev/null 2>&1; then
        _line=$(ifconfig 2>/dev/null | grep 'inet ' | grep -v '127.0.0.1' | head -1)
        _line=${_line##*inet }; _ip=${_line%% *}; _ip=${_ip#addr:}
        case "$_ip" in 127.*|172.17.*|'') ;; *) echo "$_ip"; return 0 ;; esac
    fi

    echo "ERROR cannot detect local IP (set FORCE_IP)" >&2
    return 1
}

# --- Portal config (协议探测) ---------------------------------
# loadConfig 有 rcn 字段 → AES 协议; 无 rcn → 明文协议.
# 输出: pi|pg|rc (rc 为空表示明文协议); 失败输出 ||| 并 stderr
get_config() {
    _ip="$1"
    _qs="program_index=&wlan_vlan_id=0&wlan_user_ip=$(b64e "$_ip")"
    _qs="${_qs}&wlan_user_ipv6=&wlan_user_ssid=&wlan_user_areaid="
    _qs="${_qs}&wlan_ac_ip=$(b64e '')&wlan_ap_mac=000000000000"
    _qs="${_qs}&gw_id=000000000000"
    _qs="${_qs}&callback=dr_cfg&v=$(rand)&lang=zh"
    _url="https://${_PORTAL_HOST}:${PORT_HTTPS}/eportal/portal/page/loadConfig?${_qs}"

    _r=$(http_get "$_url") || { echo "|||"; return 1; }

    _pi=$(echo "$_r" | sed -n 's/.*"program_index":"\([^"]*\)".*/\1/p' | head -1)
    _pg=$(echo "$_r" | sed -n 's/.*"page_index":"\([^"]*\)".*/\1/p' | head -1)
    _rc=$(echo "$_r" | sed -n 's/.*"rcn":"\([^"]*\)".*/\1/p' | head -1)
    [ -z "$_pi" ] && [ -z "$_pg" ] && { echo "ERROR loadConfig 响应无法解析: ${_r%%\?*}" >&2; echo "|||"; return 1; }
    echo "${_pi}|${_pg}|${_rc}"
    return 0
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
        _params=$(aes_enc "$_j") || return 1
        _params=$(url_enc "$_params")
        _url="https://${_PORTAL_HOST}:${PORT_HTTPS}/eportal/portal/login?callback=${_cb}&jsVersion=4.X&params=${_params}"
    else
        # ---- 明文协议 (8 字段 JSONP GET) ----
        _pwd_q=$(url_enc "$_pwd")
        _url="https://${_PORTAL_HOST}:${PORT_HTTPS}/eportal/portal/login?callback=${_cb}"
        _url="${_url}&user_account=${_acct}&user_password=${_pwd_q}"
        _url="${_url}&wlan_user_ip=${_ip}&wlan_user_mac=000000000000"
        _url="${_url}&terminal_type=1&lang=zh-cn&jsVersion=4.1.3"
    fi

    _r=$(http_get "$_url") || { echo "login 请求失败" >&2; return 1; }

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
    # 1) 依赖检测 (显式/检测, 缺失即退出)
    check_deps || return 1

    # 2) 连通性
    if check_net; then
        return 0
    fi

    # 3) IP
    _ip=$(get_ip) || { log "ERROR cannot detect IP"; return 1; }
    log "IP=$_ip"

    # 4) 协议探测
    _cfg=$(get_config "$_ip") || { log "ERROR loadConfig 失败"; return 1; }
    _rc="${_cfg##*|}"
    if [ -n "$_rc" ]; then
        log "PROTOCOL aes(rcn=$_rc)"
    else
        log "PROTOCOL plaintext"
    fi

    # 5) 账号列表
    _total=0 _i=0 _ok=0
    for _acc in $(grep -v '^#' "$ACCOUNTS_FILE" 2>/dev/null | grep -v '^$' | cut -d' ' -f1); do
        _total=$((_total+1))
    done
    [ "$_total" -eq 0 ] && { log "ERROR account list is empty: $ACCOUNTS_FILE"; return 1; }

    # 6) 尝试登录
    for _acc in $(grep -v '^#' "$ACCOUNTS_FILE" 2>/dev/null | grep -v '^$' | cut -d' ' -f1); do
        _i=$((_i+1))
        _short=$(echo "$_acc" | cut -c1-4)
        log "[${_i}/${_total}] trying ${_short}***"

        if _err=$(try_login "$_acc" "$PASSWORD" "$_ip" "$_cfg" 2>&1); then
            log "  OK login success: $_acc"
            _ok=1
            break
        fi
        log "  FAIL ${_err:-request failed}"
    done

    [ "$_ok" -eq 0 ] && log "ERROR all ${_total} accounts failed"
    return 0
}

# --- 启动校验 (显式配置, 不静默) ---------------------------
[ -z "$PASSWORD" ] && { echo "$(now) ERROR PASSWORD not set, edit script"; exit 1; }
[ -z "$ACCOUNTS_FILE" ] && { echo "$(now) ERROR ACCOUNTS_FILE not set, edit script"; exit 1; }
[ "$ACCOUNTS_FILE" = "/path/to/accounts.txt" ] && { echo "$(now) ERROR ACCOUNTS_FILE not set, edit script"; exit 1; }
main
