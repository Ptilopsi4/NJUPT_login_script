# NJUPT Portal 自动登录

校园网（Drcom ePortal）掉线自动重登。核心只需一个脚本；漂移监测体系为可选组件，按需启用。

## 快速开始：只用登录

绝大多数用户只需要 `portal_login.sh` 这一个文件。

**依赖**：`sh` + `curl` 或 `wget` + `openssl` + `ip` 或 `ifconfig`（OpenWrt/一般 Linux 发行版均满足）。

### 1. 配置

编辑 `portal_login.sh` 顶部：

```sh
PASSWORD="你的密码"
ACCOUNTS_FILE="/path/to/accounts.txt"
FORCE_IP=""              # 可选：强制指定 IP，留空自动检测
```

### 2. 账号文件

`accounts.txt`，每行一个学号：

```
B12345678
19198100
```

`#` 开头和空行被忽略。多账号会依次尝试，成功即止。

### 3. Crontab

```cron
* * * * * /path/to/portal_login.sh >> /var/log/portal_login.log 2>&1
```

在线时仅探测一次外网即退出（单次请求）；掉线时自动登录恢复。日志示例：

```
07-17 00:45:01 checking internet connectivity...
07-17 00:45:01   ONLINE internet reachable, skipping login
```

```
07-17 00:45:01 checking internet connectivity...
07-17 00:45:01   OFFLINE portal redirect detected
07-17 00:45:01 IP=10.161.178.202
07-17 00:45:01 PROTOCOL plaintext
07-17 00:45:01 [1/2] trying B123***
07-17 00:45:02   OK login success: ,0,B12345678
```

### 4. 工作原理

```
cron 每分钟触发:
  │
  ├─ check_net → 访问 baidu → 外网通? → exit 0
  │                （重定向特征码判定掉线: eportal/a79/Authentication 等）
  ├─ get_ip → ip addr / ifconfig → 校园网 IP
  │
  ├─ get_config → /eportal/portal/page/loadConfig
  │     有 rcn → AES 协议; 无 rcn → 明文 JSONP（自动选路）
  │
  └─ 逐账号 try_login → 成功 exit 0 / 失败下一个
```

### 5. 实现要点（BusyBox 兼容）

| 功能 | 实现 |
|------|------|
| AES-ECB | `openssl enc -aes-128-ecb -K <hex>`（rcn 存在时的协议层加密） |
| Base64 | 纯 shell 位运算 + 字符表索引（loadConfig 参数编码） |
| HTTP | `curl`/`wget` 自动检测，HTTPS(802)→HTTP(801) 降级 |
| JSON 解析 | `sed -n 's/.*"key":"\([^"]*\)".*/\1/p'` |
| IP 检测 | `ip -4 -o addr show` + `ifconfig` 兜底 |

代理环境注意：`p.njupt.edu.cn` 解析到内网，若代理（fake-ip/DNS 劫持）干扰请在 `/etc/hosts` 钉死 `10.10.244.11 p.njupt.edu.cn`，或设 `HOST_IP=10.10.244.11` 绕过 DNS。

## 可选：漂移监测体系

portal 登录逻辑时常变动。以下三个组件互相独立、也独立于登录脚本（删掉任何一个不影响登录），面向希望跟踪 portal 变更的用户：

| 组件 | 职责 | cron |
|------|------|------|
| `portal_probe.sh` | **在线巡检**（主通道）：每日拉 a79.htm/a40.js/a41.js/loadConfig，归一化（IP/MAC/时间戳占位符化）后对比 baseline，变化即 `DRIFT PROBE` 告警。portal 静态资源不鉴权，不依赖掉线窗口 | `17 4 * * *` |
| `portal_capture.sh` | **掉线取证**：掉线窗口自动抓劫持页/登录页/JS/loadConfig 存档 `captures/<ts.pid>/`（在线态静默跳过；劫持行为证据只有掉线态可观察） | `*/5` |
| `drift_check.sh` | **感知汇总**：捕获目录事件 + 登录行为信号（连败计数/失败 msg/协议切换）→ `drift_state.txt`，跃变告警 | `*/5` |

```cron
17 4 * * * /path/to/portal_probe.sh   >> /var/log/portal_login.log 2>&1
*/5 * * * * /path/to/portal_capture.sh >> /var/log/portal_login.log 2>&1
*/5 * * * * /path/to/drift_check.sh    >> /var/log/portal_login.log 2>&1
```

三者状态确认均用 `ack` 子命令（如 `portal_probe.sh ack` 推进 baseline、`drift_check.sh ack` 消除新目录待审标记）。

## 文件

| 文件 | 说明 |
|------|------|
| `portal_login.sh` | 登录守护（核心，单独可用） |
| `portal_probe.sh` / `portal_capture.sh` / `drift_check.sh` | 可选监测组件 |
| `mac_rotate.sh` | WAN MAC 每日轮换（注销→换 MAC→重租→主动登录，:02s 对齐窗口） |
| `ANALYSIS.md` | 协议逆向分析（双轨登录 API、注销协议、加密沿革） |
| `reference/` | portal 前端样本（a41 编排层 + a40 业务层） |
| `captures/` | 掉线取证存档 |
| `a41.js` / `request_sample` | 历史版本参考源码 / 请求样本 |
