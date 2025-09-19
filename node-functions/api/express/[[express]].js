import express from "express";
import path from "path";
const app = express();
const timeout = require('connect-timeout');
// xxx();
app.use(timeout('5s')); // 设置全局请求超时 5 秒

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

// 添加根路由处理
app.get("/xxx", (req, res) => {
  res.xxx({ message: "xxxx" });
});

// 设置响应头
app.get('/set-header', (req, res) => {
  res.set('X-Custom-Header', 'HelloExpress'); // 设置自定义头
  res.setHeader('Cache-Control', 'no-store'); // Node 原生方式也可以
  res.send('Headers have been set!');
});

// 重定向
app.get('/redirect', (req, res) => {
  res.redirect(302, '/api/express/set-header'); // 302 临时重定向到 /set-header
});

app.get("/users/:id/:sdasdadad", (req, res) => {
  const params = req.params.id;
  res.json({
    id: req.params.id,
    sdasdadad: req.params.sdasdadad,
    title: "Test Users API[express 路由匹配测试]",
  });
});

app.get("/timeout", (req, res) => {
  setTimeout(()=>{
    res.json({ message: "Express [express 路由匹配测试] context:" + JSON.stringify(req.context) });
  },6000)
  
})

app.get("/context", (req, res) => {
  setTimeout(()=>{
    res.json({ message: "Express [express 路由匹配测试] context:" + JSON.stringify(req.context) });
  },35000)
  
})
// 导出处理函数
export default app;
