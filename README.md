# NJUPT Portal 自动登录

## 文件

| 文件 | 说明 |
|------|------|
| `portal_login.sh` | BusyBox 登录守护 |
| `ANALYSIS.md` | 完整逆向分析报告 |
| `a41.js` / `request_sample` | 参考源码 / 请求样本 |

## 部署

### 1. 配置

编辑 `portal_login.sh` 顶部：

```sh
PASSWORD="你的密码"
ACCOUNTS_FILE="/path/to/accounts.txt"
FORCE_IP=""              # 可选：强制指定 IP
```

### 2. 账号文件

`accounts.txt`，每行一个学号：

```
B12345678
19198100
```

`#` 开头和空行被忽略。

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
07-17 00:45:01 CFG mJAHcM1783528121 Uwq9BY1783528525 mzS73ejC 1
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
  ├─ 读取 accounts.txt → 逐账号 try_login
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
