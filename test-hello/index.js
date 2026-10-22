const http = require("http");

const PORT = Number(process.env.PORT) || 3000;
const START = Date.now();

const server = http.createServer((req, res) => {
  if (req.url === "/healthz" || req.url === "/health" || req.url === "/ping") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("ok");
  }

  const up = Math.floor((Date.now() - START) / 1000);
  const mem = Math.round(process.memoryUsage().rss / 1024 / 1024);

  const body = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Test OK</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0b1020;color:#e8ecf5;
       font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
  .card{padding:40px 48px;border-radius:20px;background:rgba(255,255,255,.06);
        border:1px solid rgba(255,255,255,.12);box-shadow:0 24px 60px rgba(0,0,0,.45);text-align:center}
  .ok{font-size:52px;line-height:1}
  h1{font-size:22px;margin:16px 0 10px;font-weight:600}
  p{margin:5px 0;color:#9aa6bf;font-size:13px}
  code{color:#7dd3fc;background:rgba(125,211,252,.1);padding:1px 6px;border-radius:5px}
</style>
</head>
<body>
  <div class="card">
    <div class="ok">✅</div>
    <h1>服务运行正常</h1>
    <p>能看到这个页面，说明平台构建、启动、端口转发全部正常</p>
    <p>PORT <code>${PORT}</code> · 已运行 <code>${up}s</code></p>
    <p>Node <code>${process.version}</code> · RSS <code>${mem}MB</code></p>
    <p>启动于 ${new Date(START).toLocaleString("zh-CN")}</p>
  </div>
</body>
</html>`;

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(body);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("[test] 服务已启动 http://0.0.0.0:" + PORT);
});

process.on("uncaughtException", (e) => console.error("[test] 未捕获异常:", e && e.message));
process.on("unhandledRejection", (e) => console.error("[test] 未处理拒绝:", e && e.message));
