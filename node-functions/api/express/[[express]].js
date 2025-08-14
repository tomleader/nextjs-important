import express from "express";
import path from "path";
const app = express();

// 添加日志中间件
app.use((req, res, next) => {
  console.log("request [express 路由匹配测试，进入中间件]", req.url);
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 添加根路由处理
app.get("/", (req, res) => {
  res.json({ message: "Express [express 路由匹配测试] root path" });
});

app.get("/users/:id/:sdasdadad", (req, res) => {
  const params = req.params.id;
  res.json({
    id: req.params.id,
    sdasdadad: req.params.sdasdadad,
    title: "Test Users API[express 路由匹配测试]",
  });
});

app.get("/context", (req, res) => {
  res.json({ message: "Express [express 路由匹配测试] context:" + JSON.stringify(req.context) });
})
// 导出处理函数
export default app;