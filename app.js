const express = require('express');
const app = express();
const port = 3000; // 你可以選擇自己的伺服器端口號

// 定義路由
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});