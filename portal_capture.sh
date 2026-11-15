#!/bin/sh
# ============================================================
#  portal_capture.sh — 断网取证 (独立于登录守护)
# ============================================================
#  未认证态是唯一能观察到 portal 真实登录逻辑的窗口;
#  OFFLINE 时抓取登录页/引用 JS/loadConfig 存档, 供事后 AI 分析.
#
#  产物: CAPTURE_ROOT/<时间戳.PID>/{hijack.html,page.html,js/*.js,
#        loadConfig.txt,manifest.json}
#  去重: page.html 哈希不变 → 跳过 (断网期间每次仅 2 次请求)
#  安全: 不采集含凭据的登录请求, 存档可安全入库;
#        失败静默跳过, 绝不阻断调用方
#
#  用法:
#    portal_capture.sh [本机IP]    # IP 缺省自动探测; 在线态自动跳过
#  cron 建议 (独立于登录守护, 与 drift_check 同节奏):
#    */5 * * * * /bin/bash /root/scripts/portal_capture.sh >> /var/log/portal_login.log 2>&1
#
#  依赖: curl 或 wget, sha256sum/md5sum, sed/grep/head/cut/tr/date
# ============================================================

CAPTURE_ROOT=""                          # 空 = 脚本同目录 captures/
HOST="p.njupt.edu.cn"                    # portal 域名(与 portal_login.sh 一致)
HOST_IP=""                               # 可选: portal 直连 IP 绕过 DNS
PORT_HTTPS=802                           # 与 portal_login.sh 一致
PORT_HTTP=801
HTTP_CLIENT=""                           # 空 = 自动检测(优先 curl)

now()  { date '+%m-%d %H:%M:%S'; }
log()  { echo "$(now) $*"; }
_PORTAL_HOST="${HOST_IP:-$HOST}"

B64="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

rand() {
    _n=$(date +%s 2>/dev/null || echo 1)
    echo $(( (($$ * 1103515245 + 12345 + _n) & 0x7fffffff) % 9500 + 500 ))
}

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

# --- 依赖精简检测 ------------------------------------------
init_client() {
    if [ -n "$HTTP_CLIENT" ]; then
        command -v "$HTTP_CLIENT" >/dev/null 2>&1 || return 1
    else
        if command -v curl >/dev/null 2>&1; then HTTP_CLIENT=curl
        elif command -v wget >/dev/null 2>&1; then HTTP_CLIENT=wget
        else return 1
        fi
    fi
    return 0
}

# --- 与 portal_login.sh 同构的 http_get (https→http 降级) ---
http_get() {
    _url="$1"
    case "$HTTP_CLIENT" in
        curl) _r=$(curl -sk --max-time 10 "$_url" 2>/dev/null) ;;
        wget) _r=$(wget -qO- -T 10 "$_url" 2>/dev/null) ;;
        *) return 1 ;;
    esac
    if [ -z "$_r" ]; then
        _http=$(echo "$_url" | sed "s|https://${_PORTAL_HOST}:${PORT_HTTPS}|http://${_PORTAL_HOST}:${PORT_HTTP}|")
        if [ "$_http" != "$_url" ]; then
            case "$HTTP_CLIENT" in
                curl) _r=$(curl -sk --max-time 10 "$_http" 2>/dev/null) ;;
                wget) _r=$(wget -qO- -T 10 "$_http" 2>/dev/null) ;;
            esac
        fi
    fi
    [ -z "$_r" ] && return 1
    echo "$_r"
    return 0
}

# --- 二进制安全抓取: 直接落盘, 不经 shell 变量(变量通道会吃 NUL/换行) ---
# 优先 --compressed 透明解压; wget 无此能力时按 gzip magic 兑底解压
http_get_file() {   # $1=url $2=outfile; 成功 return 0
    _u1="$1" _f1="$2"
    _dl() {
        case "$HTTP_CLIENT" in
            curl) curl -sk --compressed --max-time 10 "$1" -o "$2" 2>/dev/null ;;
            wget) wget -q -T 10 -O "$2" "$1" 2>/dev/null ;;
        esac
    }
    _dl "$_u1" "$_f1"
    if [ ! -s "$_f1" ]; then
        _h1=$(echo "$_u1" | sed "s|https://${_PORTAL_HOST}:${PORT_HTTPS}|http://${_PORTAL_HOST}:${PORT_HTTP}|")
        [ "$_h1" != "$_u1" ] && _dl "$_h1" "$_f1"
    fi
    [ -s "$_f1" ] || return 1
    # gzip magic 1f8b 且有 gunzip → 解压为明文
    if [ "$(head -c 2 "$_f1" | od -An -tx1 2>/dev/null | tr -d ' 
')" = "1f8b" ] \
       && command -v gunzip >/dev/null 2>&1; then
        gunzip -c "$_f1" > "${_f1}.gz" 2>/dev/null \
            && mv "${_f1}.gz" "$_f1" || rm -f "${_f1}.gz"
    fi
    return 0
}

# --- 取证核心 ---------------------------------------------
# --- 断网取证 ---------------------------------------------
# $1=file → 哈希 (sha256 优先, BusyBox 兜底 md5)
file_hash() {
    if command -v sha256sum >/dev/null 2>&1; then
        sha256sum "$1" 2>/dev/null | cut -d' ' -f1
    else
        md5sum "$1" 2>/dev/null | cut -d' ' -f1
    fi
}

# 探测登录页 URL: 未认证态访问外网会被 portal 劫持.
# 劫持形态: 302 (Location 头) 或 200+跳转页(新版, 见 loadConfig visit_blacklist).
# 响应体同时存档到 $1 (hijack.html); 输出登录页完整 URL, 失败输出空
probe_login_url() {   # $1=劫持响应体存档路径
    _out="$1"
    _body=""
    if [ -n "$_out" ]; then
        # 直接落盘(头+体), 二进制安全
        case "$HTTP_CLIENT" in
            curl) curl -isk --max-time 8 "http://www.baidu.com" -o "$_out" 2>/dev/null ;;
            wget) wget -q -T 8 -S -O "$_out" "http://www.baidu.com" 2>/dev/null ;;
        esac
        _body=$(cat "$_out" 2>/dev/null)
    else
        case "$HTTP_CLIENT" in
            curl) _body=$(curl -isk --max-time 8 "http://www.baidu.com" 2>/dev/null) ;;
            wget) _body=$(wget -qO- -T 8 -S "http://www.baidu.com" 2>&1 | tr -d '\r') ;;
        esac
    fi
    case "$_body" in
        *eportal*|*njupt*|*portal*|*Authentication*|*a79.htm*|*10.10.244.11*) ;;
        *) echo ""; return 0 ;;
    esac
    # 提取跳转目标(单引号统一成双引号后匹配): 302头 → meta refresh → location.href → replace → window.location
    _u=$(echo "$_body" | grep -i '^Location:' | head -1 | sed 's/^[^:]*: *//')
    [ -z "$_u" ] && _u=$(echo "$_body" | tr "'" '"' | grep -o 'url=[^"<> ]*' | head -1 | sed 's/^url=//')
    [ -z "$_u" ] && _u=$(echo "$_body" | tr "'" '"' \
        | grep -o 'location\.\(href *=\|replace(\)[ ]*"[^"]*"' | head -1 | sed 's/^[^"]*"//; s/"$//')
    [ -z "$_u" ] && _u=$(echo "$_body" | tr "'" '"' \
        | grep -o 'window\.location[ ]*=[ ]*"[^"]*"' | head -1 | sed 's/^[^"]*"//; s/"$//')
    # 相对路径补全
    case "$_u" in
        /*) _u="https://${_PORTAL_HOST}:${PORT_HTTPS}$_u" ;;
    esac
    # 只认 portal 域特征, 防提取到无关 url=
    case "$_u" in
        *eportal*|*njupt*|*10.10.*) echo "$_u" ;;
        *) echo "" ;;
    esac
}

# 尽力而为取证: 任何失败静默跳过, 绝不阻断登录主流程
capture_evidence() {   # $1=本机 IP
    _root="$CAPTURE_ROOT"
    [ -n "$_root" ] || _root=$(cd "$(dirname "$0")" 2>/dev/null && pwd)/captures
    mkdir -p "$_root" 2>/dev/null || return 0
    rm -rf "$_root"/.tmp.* 2>/dev/null          # 清理上次中断残留

    if command -v sha256sum >/dev/null 2>&1; then _halgo=sha256; else _halgo=md5; fi

    # 1) 登录页 URL: 劫持探测(302/200+跳转页), 劫持页本身存档; 失败退回 portal 首页
    _ts=$(date '+%Y%m%d_%H%M%S')
    _tmp="$_root/.tmp.$_ts.$$"          # 带 PID: cron 多实例并发时不互相覆盖
    mkdir -p "$_tmp/js" 2>/dev/null || return 0
    _purl=$(probe_login_url "$_tmp/hijack.html")
    [ -z "$_purl" ] && _purl="https://${_PORTAL_HOST}:${PORT_HTTPS}/eportal/index.jsp"
    _base=$(echo "$_purl" | sed 's|^\(https\?://[^/]*\).*|\1|')

    # 2) 登录页抓取 (全部成功才落位)
    http_get_file "$_purl" "$_tmp/page.html" 2>/dev/null
    [ -s "$_tmp/page.html" ] || { rm -rf "$_tmp"; return 0; }

    # 3) 去重: page.html 哈希不变 → 跳过 (断网期间每次仅 2 请求)
    #    局限: JS 内容单方面轮换而页面引用不变时会漏采, 在线巡检(portal_probe)兜底
    _ph=$(file_hash "$_tmp/page.html")
    if [ -f "$_root/.last_page_hash" ] \
       && [ "$_ph" = "$(cat "$_root/.last_page_hash" 2>/dev/null)" ]; then
        rm -rf "$_tmp"
        return 0
    fi

    # 4) 抓取页面引用的 JS (上限 8 个, 防止脚本过多的页面拖慢登录)
    _n=0
    grep -o 'src="[^"]*\.js[^"]*"' "$_tmp/page.html" 2>/dev/null \
        | sed 's/^src="//; s/"$//' | head -8 > "$_tmp/js.list"
    while IFS= read -r _src; do
        [ -n "$_src" ] || continue
        case "$_src" in
            http://*|https://*) _jurl="$_src" ;;
            //*)                _jurl="https:$_src" ;;
            /*)                 _jurl="${_base}${_src}" ;;
            *)                  _jurl="${_base}/$_src" ;;
        esac
        _n=$((_n+1))
        _name=$(echo "$_src" | sed 's|?.*||; s|.*/||; s|[^A-Za-z0-9._-]|_|g')
        [ -n "$_name" ] || _name="script.js"
        http_get_file "$_jurl" "$_tmp/js/js${_n}_${_name}" 2>/dev/null
        echo "js${_n}_${_name} $(echo "$_jurl" | sed 's/"/\\\"/g')" >> "$_tmp/js.map"
    done < "$_tmp/js.list"

    # 5) loadConfig 原始响应 (协议探测输入, 与 get_config 同构)
    _qs="program_index=&wlan_vlan_id=0&wlan_user_ip=$(b64e "$1")"
    _qs="${_qs}&wlan_user_ipv6=&wlan_user_ssid=&wlan_user_areaid="
    _qs="${_qs}&wlan_ac_ip=$(b64e '')&wlan_ap_mac=000000000000&gw_id=000000000000"
    _qs="${_qs}&callback=dr_cap&v=$(rand)&lang=zh"
    http_get_file "https://${_PORTAL_HOST}:${PORT_HTTPS}/eportal/portal/page/loadConfig?${_qs}" \
        "$_tmp/loadConfig.txt" 2>/dev/null

    # 6) manifest.json: 时间/IP/来源 URL/哈希, 供 drift 检测与 AI 分析
    _jsv=$(sed -n 's/.*jsVersion[ ]*=[ ]*["'\''"]\([0-9A-Za-z._-]*\).*/\1/p' \
            "$_tmp/page.html" 2>/dev/null | head -1)
    [ -z "$_jsv" ] && _jsv=$(sed -n 's/.*fileVersion[ ]*=[ ]*["'\''"]\([0-9A-Za-z._-]*\).*/\1/p' \
            "$_tmp/page.html" 2>/dev/null | head -1)
    {
        printf '{\n'
        printf '  "captured_at": "%s",\n' "$(date '+%Y-%m-%d %H:%M:%S')"
        printf '  "wlan_user_ip": "%s",\n' "$1"
        printf '  "hash_algo": "%s",\n' "$_halgo"
        printf '  "page_url": "%s",\n' "$(echo "$_purl" | sed 's/"/\\\"/g')"
        printf '  "page_hash": "%s",\n' "$_ph"
        printf '  "jsVersion": "%s",\n' "${_jsv:-unknown}"
        printf '  "files": {\n'
        printf '    "page.html": "%s"' "$_ph"
        [ -s "$_tmp/hijack.html" ] \
            && printf ',\n    "hijack.html": "%s"' "$(file_hash "$_tmp/hijack.html")"
        [ -s "$_tmp/loadConfig.txt" ] \
            && printf ',\n    "loadConfig.txt": "%s"' "$(file_hash "$_tmp/loadConfig.txt")"
        if [ -f "$_tmp/js.map" ]; then
            while IFS= read -r _line; do
                _f=$(echo "$_line" | cut -d' ' -f1)
                [ -s "$_tmp/js/$_f" ] || continue
                printf ',\n    "js/%s": "%s"' "$_f" "$(file_hash "$_tmp/js/$_f")"
            done < "$_tmp/js.map"
        fi
        printf '\n  },\n  "js_sources": [\n'
        _first=1
        if [ -f "$_tmp/js.map" ]; then
            while IFS= read -r _line; do
                _f=$(echo "$_line" | cut -d' ' -f1); _u=$(echo "$_line" | cut -d' ' -f2-)
                [ -s "$_tmp/js/$_f" ] || continue
                [ "$_first" -eq 1 ] || printf ',\n'
                printf '    {"file": "js/%s", "url": "%s"}' "$_f" "$_u"
                _first=0
            done < "$_tmp/js.map"
        fi
        printf '\n  ]\n}\n'
    } > "$_tmp/manifest.json"

    # 7) 落位: 原子 mv + 更新去重标记 (目录名带 PID 防并发撞名)
    _cd="${_ts}.$$"
    rm -rf "$_root/$_cd" 2>/dev/null
    if mv "$_tmp" "$_root/$_cd" 2>/dev/null; then
        echo "$_ph" > "$_root/.last_page_hash"
        echo "$_cd"  > "$_root/.last_capture_dir"
        log "CAPTURE saved $_root/$_cd (${_n} js, page_${_halgo}=${_ph%${_ph#????????}}...)"
    else
        rm -rf "$_tmp"
    fi
    return 0
}

# --- 手动模式: 自动探测 IP(在线态自动跳过) ------------------
detect_ip() {
    if command -v ip >/dev/null 2>&1; then
        _line=$(ip -4 -o addr show 2>/dev/null | grep -v ' lo \|docker\|br-' | head -1)
        _line=${_line##*inet }; echo "${_line%%/*}"
        return 0
    fi
    ifconfig 2>/dev/null | grep 'inet ' | grep -v '127.0.0.1' | head -1 \
        | sed 's/.*inet //; s/ .*//'
}

# --- main --------------------------------------------------
init_client || { log "CAPTURE skip: no http client"; exit 0; }

_ip="$1"
if [ -z "$_ip" ]; then
    # 手动模式: 在线态直接跳过, 不制造证据噪音 (全文特征匹配, 同 check_net)
    _r=$(http_get "http://www.baidu.com" 2>/dev/null | head -c 400)
    case "$_r" in
        *eportal*|*njupt*|*portal*|*Authentication*|*a79*|*10.10.244.11*) ;;
        *) exit 0 ;;
    esac
    _ip=$(detect_ip)
    [ -z "$_ip" ] && { log "CAPTURE skip: cannot detect IP"; exit 0; }
fi

capture_evidence "$_ip"
exit 0
