# Argo XHTTP + TUIC（伪装站点版）

单文件 Node.js 部署：`node index.js` 即可，无需 build，无第三方依赖。

## 端口分工

| 端口 | 协议 | 用途 |
|---|---|---|
| 8001 (`ARGO_PORT`) | TCP/HTTP | 液态玻璃伪装站点 + cloudflared 回源入口 |
| 30481 (`TUIC_PORT`) | UDP/QUIC | TUIC 直连（由面板环境变量开启） |
| 8002 (`XRAY_PORT`) | TCP/HTTP | Xray xHTTP，仅 127.0.0.1 内部可达 |
| `$PORT` | TCP/HTTP | 平台注入端口，自动一并监听（健康检查用） |

链路：`客户端/浏览器 → localhost:8001 站点 → 命中 /<uuid>-xhttp → 127.0.0.1:8002 Xray`

## 部署参数

| 平台字段 | 值 |
|---|---|
| Build Command | 留空（无构建步骤） |
| Start Command | `npm start`（等价 `node index.js`） |
| Health Check Path | `/healthz` |
| Root Directory | `2. Argo XHTTP+TUIC` |

## 环境变量（全部可选，不填用内置默认值）

| 变量 | 默认 | 说明 |
|---|---|---|
| `ARGO_PORT` | 8001 | 站点/回源端口，同时决定 `XRAY_PORT = ARGO_PORT + 1` |
| `ARGO_DOMAIN` | 内置 | 固定隧道域名 |
| `ARGO_AUTH` | 内置 | 固定隧道 Token |
| `ARGO_PROTOCOL` | quic | 容器网络限制 UDP 时改 `http2` |
| `ARGO_CONNECTIONS` | 1 | 隧道连接数 |
| `TUIC_PORT` | 空 | 留空不部署 TUIC 直连 |
| `UUID` | 自动生成并持久化 | 建议固定，避免重建后订阅链接变化 |
| `TUIC_PASSWORD` | 自动生成并持久化 | 同上 |
| `LISTEN_PORTS` | 空 | 额外监听端口，逗号分隔 |
| `XHTTP_MODE` | auto | `packet-up` / `stream-up` / `stream-one` / `auto` |
| `CFIP` | www.teamviewer.com | 客户端优选域名或 IP |

## 启动后应看到的日志

```
[站点] 液态玻璃官网已上线 [::]:8001（Argo 回源入口，IPv4/IPv6 双栈）
[站点] 私有通道 /xxxx-…-xhttp → 127.0.0.1:8002（Xray xHTTP）
[Cloudflare CDN] 已连接边缘节点：XXX（XXX） | 协议：xxx
```

首次启动会下载 sing-box / Xray / cloudflared（约 100MB），需要 1~3 分钟。
