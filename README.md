# NJUPT Portal 自动登录

## 文件

| 文件 | 说明 |
|------|------|
| `portal_login.sh` | BusyBox 登录守护 |
| `ANALYSIS.md` | 完整逆向分析报告 |
| `a41.js` / `request_sample` | 参考源码 / 请求样本 |

## 部署

### 0. 依赖

脚本需要 `curl`（或 `wget`）、`openssl`、`ip`/`ifconfig`、`sed`/`grep`/`tr` 等。

> **ImmortalWrt / OpenWrt (apk 包管理)**：openssl 被拆分为 `libopenssl3`（库）+ `openssl-util`（CLI），路由器默认只有库没有 CLI。需安装：
>
> ```sh
> apk add openssl-util
> ```
>
> 验证：`echo -n test | openssl enc -aes-128-ecb -K 35433164356164346465613065386464 -nosalt | openssl base64 -A` 应输出非空密文。

### 1. 配置

编辑 `portal_login.sh` 顶部：

```sh
ACCOUNTS_FILE="/path/to/accounts.csv"
FORCE_IP=""              # 可选：强制指定登录 IP（如多网卡）
SRC_IF=""                # 可选：绑定源网卡（多网卡环境必填）
HOST_IP="10.10.244.11"   # 可选：portal 直连 IP（绕过 DNS）
```

> **DNS 注意**：`p.njupt.edu.cn` 在内网 DNS 中可能解析失败，需将 `HOST_IP` 设为 `10.10.244.11`（或 `/etc/hosts` 钉死）才能连上 portal。
>
> **多网卡注意**：路由器（单网卡）无需 `SRC_IF`。Windows/多网卡环境（如 WLAN + 以太网 + VPN 并存）必须设置 `FORCE_IP`（登录 IP）和 `SRC_IF`（curl `--interface` 绑定源网卡），否则请求可能从错误网卡发出，portal 会以「认证操作非本机终端」拒绝。curl 自带 `--noproxy '*'`，不受本机代理影响。

### 2. 账号文件

`accounts.csv`，每行一个账号，格式 `账号,密码`：

```
B12345678,myPass123
19198100,anotherPass456
```

`#` 开头和空行被忽略。

**特殊字符**：密码含逗号/引号/空格时，用双引号包裹整个密码，内部引号用两个双引号转义：

```
B12345678,"pa,ss"        # 密码含逗号
B12345678,"pa""ss"       # 密码含引号
B12345678,"my pass"      # 密码含空格
```

支持 Windows 编辑保存的 CRLF 行尾。

### 3. Crontab

```cron
* * * * * /path/to/portal_login.sh >> /var/log/portal_login.log 2>&1
```

日志示例：

```
07-17 00:45:01 checking internet connectivity...
07-17 00:45:01   ONLINE internet reachable, skipping login
```

```
07-17 00:45:01 checking internet connectivity...
07-17 00:45:01   OFFLINE no response from baidu
07-17 00:45:01 IP=10.161.178.202 key=17
07-17 00:45:01 PROTOCOL aes(rcn=rgoAJdqp)
07-17 00:45:01 [1/3] trying B123***
07-17 00:45:02   OK login success: ,0,B12345678
```

### 4. 流程

```
cron 每分钟触发:
  │
  ├─ check_net → wget baidu.com → 外网通? → exit 0
  │
  ├─ get_ip → ip addr / ifconfig → 校园网 IP
  │
  ├─ get_config → /eportal/portal/page/loadConfig
  │     获取 program_index、page_index、rcn
  │
  ├─ 读取 accounts.csv → 逐账号 try_login
  │     ├─ 成功 → 记录日志并 exit 0
  │     └─ 失败 → 尝试下一个
  │
  └─ 全部失败 → 记录日志并 exit 0
```

### 5. 纯 shell 实现要点

| 功能 | 仅用 busybox |
|------|-------------|
| Base64 | `printf '%d' "'$c"` + 位运算 + B64 字符表索引 |
| XOR 加密 | `$((asc ^ key))` + `printf '%02x'` |
| HTTP | `wget -qO- -T 10`，HTTPS→HTTP 自动降级 |
| JSON 解析 | `sed -n 's/.*"key":"\([^"]*\)".*/\1/p'` |
| IP 检测 | `ip -4 -o addr show` + `ifconfig` |
| 随机数 | `($$ * 1103515245 + date +%s) % 9500 + 500` |
