# NJUPT Portal (Drcom ePortal) 登录 — 逆向分析

## 请求端点

```
POST /eportal/portal/login  (实质 JSONP GET)
Host: p.njupt.edu.cn:804
```

## 加密机制

### 1. 密钥生成 `getkey(ip)`

```javascript
function getkey(ip) {
    var ret = 0;
    for (var i = 0; i < ip.length; i++)
        ret ^= ip.charCodeAt(i);
    return ret;  // 0x00–0xFF
}
```

将 IP 字符串中每个字符的 ASCII 码连续 XOR，得到 1 字节密钥。

示例：`getkey("10.161.178.215")` = `0x11` (17)

### 2. 值加密 `enc_pwd(value, key)`

```javascript
function enc_pwd(passIn, key) {
    var passOut = "";
    for (var i = 0; i < passIn.length; i++) {
        ch = passIn.charCodeAt(i) ^ key;
        str = ch.toString(16);
        if (str.length == 1) str = "0" + str;
        passOut += str;
    }
    return passOut;
}
```

每个字符与密钥 XOR，结果转为 2 位小写十六进制（不足两位左补 0）。

示例：`enc_pwd("0", 0x11)` = `"21"`（因为 `'0'=0x30, 0x30^0x11=0x21`）

### 3. 参数双层编码

| 字段 | 编码方式 | 示例 |
|------|---------|------|
| `user_account` | 原始值 → **base64** → XOR → hex | `,0,<sid>` → `***` → `***` |
| `user_password` | 原始值 → **base64** → XOR → hex | `<pwd>` → `***` → `***` |
| `user_agent` | 原始值 → **base64** → XOR → hex | (UA 字符串) |
| 其余所有参数 | 原始值 → XOR → hex | `10.161.178.215` → `20213f2027203f2026293f232024` |

### 4. 明文参数

以下参数**不加密**，直接追加在 URL query string 末尾：

- `encrypt=1` — 标记请求已加密
- `v=<random>` — 防缓存随机数 (500–10000)
- `lang=zh` — 语言标识

### 5. 完整请求流

```
构建 params.data (原始值)
    │
    ├─ user_account / password / user_agent:
    │      raw → base64 → enc_pwd() → hex
    │
    └─ 其余参数:
           raw → enc_pwd() → hex
    │
    ▼
追加 encrypt=1, v=<random>, lang=zh
    │
    ▼
GET /eportal/portal/login?callback=drXXX&login_method=21&...&encrypt=1&v=7748&lang=zh
    │
    ▼
JSONP 响应: drXXX({result: 1, uid: "...", ...})
```

### 6. 加密前原始参数清单

| 参数 | 示例值 | 说明 |
|------|--------|------|
| `callback` | `dr1003` | JSONP 回调名 |
| `login_method` | `1` | 认证方式 |
| `is_base64encode` | `1` | 告知服务端 account/pwd 经过 base64 |
| `user_account` | `,0,<sid>` | NJUPT 格式: `,0,{学号}` |
| `user_password` | `<pwd>` | 密码明文 |
| `wlan_user_ip` | `10.161.178.215` | 终端 IP |
| `wlan_user_ipv6` | (空) | IPv6 地址 |
| `wlan_user_mac` | `000000000000` | MAC 地址 |
| `wlan_vlan_id` | `0` | VLAN ID |
| `wlan_ac_ip` | (空) | AC IP |
| `wlan_ac_name` | (空) | AC 名称 |
| `authex_enable` | (空) | PPPoE 代拨标识 |
| `jsVersion` | `4.5` | 页面版本 |
| `terminal_type` | `1` | 终端类型 (1=PC) |
| `lang` | `zh-cn` | 语言 |
| `user_agent` | (浏览器 UA) | User-Agent |
| `enable_r3` | `0` | PPPoE 代拨开关 |
| `mac_type` | `0` | 终端类型 (0=PC) |
| `rcn` | `<random>` | 页面随机数（来自 loadConfig） |
| `operate` | `portal_login` | 操作类型 |
| `business_type` | `1` | 业务类型 (1=账号认证) |
| `program_index` | `<random>` | 方案索引（来自 loadConfig） |
| `page_index` | `<random>` | 页面索引（来自 loadConfig） |
| `encrypt` | `1` | **明文**，加密标记 |

### 7. 样本验证

以 `request_sample` 中的 IP `10.161.178.215` 计算密钥：

```
key = getkey("10.161.178.215") = 0x11
```

| 参数 | 加密值（hex） | 解密值 | 匹配 |
|------|-------------|--------|:--:|
| `user_account` | `***` | `,0,<sid>` | ✓ |
| `user_password` | `***` | `<pwd>` | ✓ |
| `wlan_user_ip` | `20213f2027203f2026293f232024` | `10.161.178.215` | ✓ |
| `wlan_user_mac` | `212121212121212121212121` | `000000000000` | ✓ |
| `enable_r3` | `21` | `0` | ✓ |
| `lang` | `6b793c727f` | `zh-cn` | ✓ |
| `operate` | `617e6365707d4e7d7e76787f` | `portal_login` | ✓ |
| `login_method` | `20` | `1` | ✓ |
| `terminal_type` | `20` | `1` | ✓ |
| `is_base64encode` | `20` | `1` | ✓ |
| `business_type` | `20` | `1` | ✓ |
| `mac_type` | `21` | `0` | ✓ |
| `jsVersion` | `253f24` | `4.5` | ✓ |

### 8. 页面配置接口

```
GET /eportal/portal/page/loadConfig?program_index=&wlan_vlan_id=0&wlan_user_ip=<base64(ip)>&...
```

**不走** `page_data_encrypt` 加密（`a41.js:3939`），但 `wlan_user_ip` / `wlan_ac_ip` 使用 base64 编码。

返回关键字段：

| 字段 | 说明 |
|------|------|
| `data.program_index` | 方案索引 |
| `data.page_index` | 页面索引 |
| `data.rcn` | 随机数 |
| `data.login_method` | 认证方式 |

### 9. apg 加密（未启用）

`apg_switch='0'`，当前页面不使用 apg 加密。若启用（`apg_switch='1'`），会在页面加密之前先用 AES-ECB + PKCS7 对整体参数做一层加密，密钥为 `apg_page_secret='5C1d5ad4dea0e8dd'`。

### 10. NJUPT 账号格式

```
,0,{学号}
```

- `,` 前为空 = 未选服务
- `0` = 标志位
- 学号 = 校园网账号

### 11. 加密类型选择

```javascript
encryption_type = '0'  // 0=IP密钥, 1=固定密钥(secret_key='drcom')
page_data_encrypt = '1' // 页面传输加密开关
```

当前使用 **IP 密钥模式**：`getkey(term.ip)`。

若切换到 `encryption_type='1'`，则改用固定字符串 `"drcom"` 的 XOR 结果作为密钥。

### 12. 未加密接口白名单

在 `a41.js:3931-3941`，以下 URL 模式**不触发加密**：

- `wifidog/disconnect`
- `page/loadConfig`

---

# 2026-11 协议现状: 双轨明文 (基于 a41.js/a40.js v1783574036093)

> 取证来源: captures/20261116_032100.7457 (劫持页→a79.htm 链路) +
> reference/20261116/ (干净样本, curl --compressed 直拉)。
> 旧章节描述的 XOR/getkey 加密体系已随旧版前端退役。

## 架构

```
劫持: 访问外网 → 200 + location.href → http://10.10.244.11/a79.htm (非 302)
a79.htm: Drcom 壳页, 内联明文配置(端点/字段名/运营商表) + fileVersion
a41.js (38KB): 编排器 — loadConfig/checkStatus/perceive + util(_jsonp/base64/ipToParseInt)
a40.js (166KB): 业务 — login/logout/online_list/改密/自服务, isJSMin=1 单体加载
```

## 双轨登录 API (并存)

| | drcom 内核轨 (login_method=0) | eportal JSONP 轨 (login_method=1, 当前线上) |
|---|---|---|
| 端点 | `http://10.10.244.11/drcom/login` | `https://p.njupt.edu.cn:802/eportal/portal/login` |
| 账号字段 | `DDDDD` | `user_account` |
| 密码字段 | `upass` (en_md5=1 时 MD5(PID+pwd+CALG)+CALG+PID) | `user_password` (**明文**, en_md5=0) |
| 特征参数 | `0MKKey=123456`, R1/R2/R3/R6/R7/R10, para, v6ip | login_method/terminal_type/lang/jsVersion |
| 响应 | JSONP `dr<N>` callback | 同左 |

- NJUPT 当前 loadConfig: `login_method=1`, `en_md5=0` → eportal 轨明文 JSONP
- login.sh 明文分支与 `login.login_portal` 参数表同构 (端点/字段对齐), 故前端换代不影响脚本

## 注销协议

```
GET /eportal/portal/logout
    callback=dr<N>&login_method=1
    &user_account=drcom&user_password=123      ← 固定凭据, 服务端按 IP/MAC 鉴权
    &ac_logout=<0|1>&register_mode=<n>
    &wlan_user_ip=<ip>&wlan_user_ipv6=&wlan_vlan_id=<vlan>
    &wlan_user_mac=<mac>&wlan_ac_ip=&wlan_ac_name=&jsVersion=<v>
```

`ac_logout`(loadConfig)=1 → Radius 注销。旧版 `wifidog/disconnect` 在加密白名单中残留, 新前端已不用。

## 其他端点 (a41/a40 全集)

| 端点 | 用途 |
|---|---|
| `eportal/portal/page/loadConfig` | 页面配置 (b64(ip), 不加密) |
| `drcom/chkstatus` | 在线状态 (login_method=0) |
| `eportal/portal/online_list` | 在线状态 (check_online_method=1, **IP 转十进制整数** ipToParseInt) |
| `eportal/portal/perceive` | 无感知认证 |
| `eportal/portal/visitor/checkUserStateByIP` | 访客 IP 状态 |
| `eportal/portal/login/logout` | 登录/注销 |

## 运营商后缀 (a79.htm carrier 配置)

`""`=校园用户(默认) / `@dx`=电信 / `@lt`=联通 — 账号池轮换时后缀须与运营商匹配, 不匹配是轮换失败的候选根因。
