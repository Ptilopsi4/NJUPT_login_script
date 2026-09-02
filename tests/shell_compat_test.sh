#!/bin/sh
set -eu

TEST_DIR=$(CDPATH='' cd -P "$(dirname "$0")" && pwd)
SCRIPT_PATH="${TEST_DIR}/../portal_login.sh"

# 只加载函数定义，不执行脚本末尾的配置校验和 main。
eval "$(sed '/^# --- 启动校验/,$d' "$SCRIPT_PATH")"

fail() {
    printf 'FAIL %s\n' "$1" >&2
    exit 1
}

assert_eq() {
    _expected=$1
    _actual=$2
    _label=$3
    [ "$_actual" = "$_expected" ] \
        || fail "${_label}: expected=[${_expected}] actual=[${_actual}]"
}

assert_eq "" "$(b64e '')" "empty base64"
assert_eq "MTAuMC4wLjE=" "$(b64e '10.0.0.1')" "IPv4 base64"
assert_eq 'a\"b\\c' "$(json_esc 'a"b\c')" "JSON escaping"
assert_eq "a%2Bb%2Fc%3Dd%26e%20f" "$(url_enc 'a+b/c=d&e f')" "URL encoding"

if [ "${TEST_REAL_IP:-0}" = "1" ]; then
    _real_ip=$(get_ip) || fail "generic Linux real IP detection"
    case "$_real_ip" in
        ""|127.*) fail "generic Linux returned invalid IP: $_real_ip" ;;
    esac
    printf 'REAL_IP generic_linux=%s\n' "$_real_ip"
fi

# OpenWrt/netifd 分支。
ubus() {
    printf '%s\n' '{"ipv4-address":[{"address":"10.20.30.40"}]}'
}
jsonfilter() {
    cat >/dev/null
    printf '%s\n' "10.20.30.40"
}
assert_eq "10.20.30.40" "$(get_ip)" "OpenWrt ubus IP detection"

# 非 OpenWrt Linux 默认路由分支。让 ubus 路径返回空，确认能够安全回退。
ubus() { return 1; }
jsonfilter() { cat >/dev/null; return 1; }
ip() {
    case "$*" in
        "-4 route show default")
            printf '%s\n' "default via 10.0.0.1 dev eth1"
            ;;
        "-4 -o addr show dev eth1")
            printf '%s\n' "2: eth1    inet 10.50.60.70/24 brd 10.50.60.255 scope global eth1"
            ;;
        *)
            return 1
            ;;
    esac
}
assert_eq "10.50.60.70" "$(get_ip)" "generic Linux route IP detection"

printf 'PASS shell=%s\n' "${TEST_SHELL_NAME:-unknown}"
