#!/bin/sh
# ============================================================
#  portal_probe.sh — 在线巡检: portal 资源 drift 主动检测
# ============================================================
#  portal 的静态资源与 loadConfig 不鉴权(在线态可拉, 已实测
#  58 字段与掉线态零差异), 故巡检不依赖掉线窗口, 每日主动采样:
#
#    a79.htm   壳页: fileVersion/端点/字段名/运营商配置
#    a41.js    编排器 / a40.js 业务逻辑
#    loadConfig.json  协议权威配置(端口/开关/认证方式)
#
#  对比: 归一化(IP/MAC/时间戳类易变字段置占位符)后哈希 vs baseline
#  产物: PROBE_ROOT/<ts.pid>/ 四件套 + manifest.json
#  告警: 变化时向 stdout 报 DRIFT PROBE 行(cron 重定向进日志)
#  确认: portal_probe.sh ack 将当前采样推进为 baseline
#
#  cron 建议 (每日一次, 错开整点):
#    17 4 * * * /bin/bash /root/scripts/portal_probe.sh >> /var/log/portal_login.log 2>&1
# ============================================================

PROBE_ROOT=""                            # 空 = 脚本同目录 probe
HOST="p.njupt.edu.cn"                    # loadConfig 域名(802)
HOST_API=""                              # 可选: 直连 IP 绕过 DNS
PORT_HTTPS=802
A79_HOST="10.10.244.11"                  # 静态资源主机(a79/a40/a41, 80)
FILE_VERSION=""                          # 可选: 指定版本参数, 空=不带
HTTP_CLIENT=""

now()  { date '+%m-%d %H:%M:%S'; }
log()  { echo "$(now) $*"; }
_API="${HOST_API:-$HOST}"

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

file_hash() {
    if command -v sha256sum >/dev/null 2>&1; then
        sha256sum "$1" 2>/dev/null | cut -d' ' -f1
    else
        md5sum "$1" 2>/dev/null | cut -d' ' -f1
    fi
}

# 二进制安全抓取(--compressed 透明解压), 成功 return 0
fetch() {   # $1=url $2=outfile
    case "$HTTP_CLIENT" in
        curl) curl -sk --compressed --max-time 15 "$1" -o "$2" 2>/dev/null ;;
        wget) wget -q -T 15 -O "$2" "$1" 2>/dev/null ;;
        *) return 1 ;;
    esac
    [ -s "$2" ]
}

rand() { echo $(( ($$ + $(date +%s 2>/dev/null || echo 1)) % 9500 + 500 )); }

# 归一化: 消除按请求方渲染的易变字段与字节级噪声, 只留协议特征
#   IPv4 / ss1-ss6,ipm,mip 的 hex / timet,version 时间戳 / rcn 随机数 / aolno
#   以及 CR、行尾空白、末尾换行缺失(服务端重发布常 strip 尾换行)
normalize() {   # $1=infile $2=outfile
    sed -e 's/[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}/IP/g' \
        -e 's/\(ss[0-9]\|mip\|ipm\)[ ]*=[ ]*["'"'"']\{0,1\}[0-9a-fA-F]*/\1=X/g' \
        -e 's/aolno[ ]*=[ ]*[0-9]\+/aolno=X/g' \
        -e 's/timet[ ]*=[ ]*[0-9]\{8,\}/timet=T/g' \
        -e 's/version=[0-9]\{10,\}/version=V/g' \
        -e 's/"rcn":"[^"]*"/"rcn":"R"/g' \
        -e 's/[[:space:]]\{1,\}$//' \
        "$1" 2>/dev/null | tr -d '\r' | awk '{printf "%s\n", $0}' > "$2"
    [ -s "$2" ]
}

# --- 采样: 四件套归一化落盘到 $1 ------------------------------
collect() {   # $1=目标目录; 全部成功 return 0
    _d="$1"
    _v=""; [ -n "$FILE_VERSION" ] && _v="?version=${FILE_VERSION}"
    fetch "http://${A79_HOST}/a79.htm${_v}" "$_d/a79.htm" || return 1
    fetch "http://${A79_HOST}/a41.js${_v}" "$_d/a41.js"   || return 1
    fetch "http://${A79_HOST}/a40.js${_v}" "$_d/a40.js"   || return 1
    _ip=$(ip -4 -o addr show 2>/dev/null | grep -v ' lo \|docker\|br-' | head -1)
    _ip=${_ip##*inet }; _ip=${_ip%%/*}
    [ -n "$_ip" ] || _ip="0.0.0.0"
    _b64=$(printf '%s' "$_ip" | { command -v base64 >/dev/null 2>&1 && base64 | tr -d '\n'; } )
    [ -n "$_b64" ] || _b64="$_ip"
    fetch "https://${_API}:${PORT_HTTPS}/eportal/portal/page/loadConfig?program_index=&wlan_vlan_id=0&wlan_user_ip=${_b64}&wlan_user_ipv6=&wlan_user_ssid=&wlan_user_areaid=&wlan_ac_ip=&wlan_ap_mac=000000000000&gw_id=000000000000&callback=dr_probe&v=$(rand)&lang=zh" \
        "$_d/loadConfig.json" || return 1
    # 归一化副本
    normalize "$_d/a79.htm" "$_d/a79.norm" || return 1
    return 0
}

# --- manifest: 归一化哈希 ------------------------------------
gen_manifest() {   # $1=目录
    _d="$1"
    {
        echo "a79=$(file_hash "$_d/a79.norm")"
        echo "a41=$(file_hash "$_d/a41.js")"
        echo "a40=$(file_hash "$_d/a40.js")"
        echo "loadConfig=$(file_hash "$_d/loadConfig.json")"
    } > "$_d/manifest" 2>/dev/null
}

# --- main --------------------------------------------------
init_client || { log "PROBE skip: no http client"; exit 0; }
_root="$PROBE_ROOT"
[ -n "$_root" ] || _root=$(cd "$(dirname "$0")" 2>/dev/null && pwd)/probe
mkdir -p "$_root/baseline" 2>/dev/null || exit 0
rm -rf "$_root"/.tmp.* 2>/dev/null

_tmp="$_root/.tmp.$$"
mkdir -p "$_tmp" 2>/dev/null || exit 0

if ! collect "$_tmp"; then
    log "PROBE ERROR fetch failed (portal 不可达或资源缺失)"
    rm -rf "$_tmp"
    exit 0
fi
gen_manifest "$_tmp"

# ack: 当前采样推进为 baseline
if [ "$1" = "ack" ]; then
    rm -rf "$_root/baseline"
    mkdir -p "$_root/baseline"
    cp "$_tmp"/a79.norm "$_tmp"/a41.js "$_tmp"/a40.js "$_tmp"/loadConfig.json "$_root/baseline/" 2>/dev/null
    cp "$_tmp/manifest" "$_root/baseline/manifest" 2>/dev/null
    rm -rf "$_tmp"
    log "PROBE acked, baseline updated"
    exit 0
fi

# 对比 baseline
_chg=1
if [ -f "$_root/baseline/manifest" ]; then
    if [ "$(file_hash "$_tmp/manifest")" = "$(file_hash "$_root/baseline/manifest")" ]; then
        _chg=0
    fi
fi

if [ "$_chg" = "0" ]; then
    rm -rf "$_tmp"          # 无变化不留档, baseline 即基线快照
    exit 0
fi

_cd="$(date '+%Y%m%d_%H%M%S').$$"
mv "$_tmp" "$_root/$_cd" 2>/dev/null || { rm -rf "$_tmp"; exit 0; }
log "DRIFT PROBE portal 资源变化: 样本 $_root/$_cd, 确认后 portal_probe.sh ack"
exit 0
