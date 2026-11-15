#!/bin/sh
# ============================================================
#  drift_check.sh — 路由器侧 drift 传感器 (L0 目录事件 + L2 行为信号)
# ============================================================
#  零侵入: 只读 portal_login.sh 的产物 (日志 + captures/), 不碰登录流程
#    L0 目录事件: captures/ 出现新目录 / jsVersion 跨目录变化
#    L2 行为信号: 登录连续全败计数 / 失败 msg / 协议(AES/明文)切换
#
#  产物: CAPTURES/drift_state.txt (key=value, 原子写, 供本机侧拉取)
#  输出: 仅状态变化时向 stdout 报 DRIFT 行 (cron 重定向进同一日志)
#
#  用法:
#    drift_check.sh        检测并更新状态
#    drift_check.sh ack    确认当前最新 capture, 消除 new_capture 标记
#
#  cron 建议 (与 login.sh 同日志, 5 分钟一拍):
#    */5 * * * * /bin/bash /root/scripts/drift_check.sh >> /var/log/portal_login.log 2>&1
# ============================================================

LOG="/var/log/portal_login.log"
CAPTURES="/root/scripts/captures"      # 与 portal_login.sh 的 CAPTURE_ROOT 一致
STATE="$CAPTURES/drift_state.txt"
STREAK_ALERT=3                         # 连续 N 个掉线周期全部账号失败 → 告警
TAIL_N=300                             # 行为信号分析窗口 (行)

now() { date '+%m-%d %H:%M:%S'; }
log()  { echo "$(now) $*"; }

# $1=file → 哈希 (sha256 优先, busybox 兜底 md5; 与 portal_login.sh 同构)
file_hash() {
    if command -v sha256sum >/dev/null 2>&1; then
        sha256sum "$1" 2>/dev/null | cut -d' ' -f1
    else
        md5sum "$1" 2>/dev/null | cut -d' ' -f1
    fi
}

# 读当前状态字段: st_get <key>
st_get() { [ -f "$STATE" ] && sed -n "s/^$1=//p" "$STATE" | head -1; }

# manifest 提取 jsVersion (portal_capture 产物格式)
mf_jsv() { sed -n 's/.*"jsVersion": "\([^"]*\)".*/\1/p' "$1" 2>/dev/null | head -1; }

mkdir -p "$CAPTURES" 2>/dev/null

# ---------------- L0: 目录事件 ----------------
# 最新捕获目录 (marker 为准, 校验目录真实存在)
_last=""
[ -f "$CAPTURES/.last_capture_dir" ] && _last=$(cat "$CAPTURES/.last_capture_dir" 2>/dev/null)
[ -n "$_last" ] && [ ! -d "$CAPTURES/$_last" ] && _last=""
_acked=$(st_get acked_dir)

_new=0
[ -n "$_last" ] && [ "$_last" != "$_acked" ] && _new=1

# jsVersion 对比: 最新目录 vs 时间序上的前一个目录
_newv="" _prevv=""
if [ -n "$_last" ]; then
    _newv=$(mf_jsv "$CAPTURES/$_last/manifest.json")
    _prev=$(ls -1 "$CAPTURES" 2>/dev/null | grep '^[0-9]' \
            | awk -v L="$_last" '$0==L{print p; exit} {p=$0}')
    [ -n "$_prev" ] && _prevv=$(mf_jsv "$CAPTURES/$_prev/manifest.json")
fi
_vc=0
[ -n "$_newv" ] && [ -n "$_prevv" ] && [ "$_newv" != "$_prevv" ] && _vc=1

# ---------------- L2: 行为信号 ----------------
_streak=0 _msgs="" _aes=0 _plain=0
if [ -f "$LOG" ]; then
    # 连续全败周期数: "ERROR all" 累积, "OK login success" 清零, ONLINE 不打断
    _streak=$(tail -n $TAIL_N "$LOG" | awk '
        /OK login success/ { s=0 }
        /ERROR all /       { s++ }
        END { print s+0 }')
    # 近期失败 msg 去重 (最多 3 条, | 分隔; tr 拼 — busybox 无 paste)
    _msgs=$(tail -n $TAIL_N "$LOG" | sed -n 's/^.*  FAIL //p' \
            | sort -u | head -3 | tr '\n' '|' | sed 's/|$//' | cut -c1-120)
    _aes=$(tail -n $TAIL_N "$LOG" | grep -c 'PROTOCOL aes')
    _plain=$(tail -n $TAIL_N "$LOG" | grep -c 'PROTOCOL plaintext')
fi
_failing=0
[ "$_streak" -ge "$STREAK_ALERT" ] && _failing=1
_pfailing=$(st_get login_failing)   # 跃变检测: 旧值在原子写前读取
_mixed=0
[ "$_aes" -gt 0 ] && [ "$_plain" -gt 0 ] && _mixed=1

# ---------------- 生成状态 (原子写) ----------------
_tmp="$CAPTURES/.drift_state.tmp"
{
    echo "ts=$(date '+%Y-%m-%d %H:%M:%S')"
    echo "acked_dir=$_acked"
    echo "last_dir=$_last"
    echo "new_capture=$_new"
    echo "new_jsVersion=${_newv:-unknown}"
    echo "prev_jsVersion=${_prevv:-unknown}"
    echo "jsVersion_changed=$_vc"
    echo "login_fail_streak=$_streak"
    echo "login_failing=$_failing"
    echo "fail_msgs=$_msgs"
    echo "protocol_aes=$_aes"
    echo "protocol_plain=$_plain"
    echo "protocol_mixed=$_mixed"
} > "$_tmp" 2>/dev/null

# ---------------- ack: 确认最新 capture 后退出 ----------------
if [ "$1" = "ack" ]; then
    sed -i "s/^acked_dir=.*/acked_dir=$_last/; s/^new_capture=.*/new_capture=0/" "$_tmp"
    mv "$_tmp" "$STATE"
    log "DRIFT acked capture=${_last:-none}"
    exit 0
fi

# ---------------- 正常路径: 对比上次状态, 有变化才报 ----------------
# (busybox 可能无 diff, 用哈希对比; _chg: 999=首跑 1=变化 0=无变化)
_chg=999
if [ -f "$STATE" ]; then
    grep -v '^ts=' "$STATE" > "${_tmp}.old" 2>/dev/null
    grep -v '^ts=' "$_tmp"   > "${_tmp}.new"
    if [ "$(file_hash "${_tmp}.old")" = "$(file_hash "${_tmp}.new")" ]; then
        _chg=0
    else
        _chg=1
    fi
    rm -f "${_tmp}.old" "${_tmp}.new"
fi
mv "$_tmp" "$STATE"

if [ "$_chg" -gt 0 ]; then
    log "DRIFT state changed: new_capture=$_new jsVersion_changed=$_vc fail_streak=$_streak failing=$_failing mixed=$_mixed"
fi
if [ "$_failing" = "1" ] && [ "$_pfailing" != "1" ]; then
    log "DRIFT ALERT login failing streak=$_streak (msg: ${_msgs%%|*})"
elif [ "$_pfailing" = "1" ] && [ "$_failing" = "0" ]; then
    log "DRIFT recovered: login ok again"
fi
exit 0
