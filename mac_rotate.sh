#!/bin/sh
# ============================================================
#  WAN MAC 定时轮换 (NJUPT 校园网)
#  流程: 对齐窗口 -> 注销(清会话记录) -> 换 MAC -> 重租 -> 主动登录
#  竞态规避: 对齐到每分钟 :02 秒启动, 独享 ~58s 无干扰窗口
#  (login.sh 每分钟 :00 tick, 已错开; 全程在下一 tick 前闭环)
# ============================================================

LOG=/var/log/mac_rotate.log
LOCK=/tmp/mac_rotate.lock
PORTAL_HOST="p.njupt.edu.cn"

log() { echo "$(date '+%m-%d %H:%M:%S') $*" >> $LOG; }

# 单实例保护(锁超过 10 分钟视为残留自动清, 防卡死实例挡后续轮换)
if [ -f "$LOCK" ]; then
    [ $(( $(date +%s) - $(date -r "$LOCK" +%s 2>/dev/null || echo 0) )) -lt 600 ] \
        && { log "已有实例在运行, 退出"; exit 1; }
    log "锁残留超时, 自动清理"
    rm -f "$LOCK"
fi
trap 'rm -f "$LOCK"' EXIT
touch "$LOCK"

# 0) 对齐到分钟 :02 秒 (避开 login.sh 的 :00 tick)
_s=$(date +%S)
_sleep=$(( 62 - _s ))
[ "$_sleep" -gt 58 ] && _sleep=2
[ "$_sleep" -gt 1 ] && sleep "$_sleep"

# 1) 记录旧身份
OLD_MAC=$(cat /sys/class/net/wan/address)
OLD_IP=$(timeout 3 ubus call network.interface.wan status 2>/dev/null | jsonfilter -e '@["ipv4-address"][0].address')

# 2) 注销旧会话: 发起 Radius 注销请求(已验证网络无感);
#    是否清理设备记录未直接验证——若账号设备数挤占, 症状为轮换后
#    首账号失败, 由 drift_check 的 fail_msgs 观测捕获
if [ -n "$OLD_IP" ]; then
    _mac=$(cat /sys/class/net/wan/address | tr -d ':' | tr 'a-f' 'A-F')
    _resp=$(curl -sk --max-time 5 "https://${PORTAL_HOST}:802/eportal/portal/logout?callback=dr1004&login_method=1&user_account=drcom&user_password=123&ac_logout=1&register_mode=1&wlan_user_ip=${OLD_IP}&wlan_user_ipv6=&wlan_vlan_id=0&wlan_user_mac=${_mac}&wlan_ac_ip=&wlan_ac_name=&jsVersion=4.X" 2>/dev/null)
    case "$_resp" in
        *'"result":1'*|*'"result":"ok"'*) log "旧会话已注销 (ip=$OLD_IP)" ;;
        *) log "旧会话注销未确认 (ip=$OLD_IP, 响应: $(echo "$_resp" | head -c 60))" ;;
    esac
fi
# 3) 生成随机本地管理 MAC (02 开头 = 局部单播, 合法)
NEW_MAC=$(printf '02:%02x:%02x:%02x:%02x:%02x' \
    $((RANDOM%256)) $((RANDOM%256)) $((RANDOM%256)) $((RANDOM%256)) $((RANDOM%256)))
# 兜底: 未开 ASH_RANDOM_SUPPORT 的 busybox 里 $RANDOM 恒零 → 用 /dev/urandom
[ "$NEW_MAC" = "02:00:00:00:00:00" ] && NEW_MAC="02$(hexdump -n4 -e '4/1 ":%02x"' /dev/urandom)"

# 4) 写入 uci 设备节 (首次运行自动创建)
[ -z "$(uci -q get network.wan_dev.name)" ] && {
    uci set network.wan_dev=device
    uci set network.wan_dev.name='wan'
}
uci set network.wan_dev.macaddr="$NEW_MAC"
uci commit network

# 5) 重启 WAN (v4 + v6 同步换身份)
ifup wan
ifup wan6
log "MAC: $OLD_MAC -> $NEW_MAC (ifup 已触发)"

# 6) 等待新租约 (最多 25 秒)
NEW_IP=""
i=0
while [ "$i" -lt 25 ]; do
    sleep 1; i=$((i+1))
    NEW_IP=$(timeout 3 ubus call network.interface.wan status 2>/dev/null | jsonfilter -e '@["ipv4-address"][0].address')
    [ -n "$NEW_IP" ] && [ "$NEW_IP" != "$OLD_IP" ] && break
done
log "IP: ${OLD_IP:-无} -> ${NEW_IP:-未获取} (${i}s)"

# 7) 主动登录新会话 (不等下一分钟 tick)
sh /root/scripts/login.sh >> /var/log/portal_login.log 2>&1
log "轮换完成, 已主动触发 portal 登录"
