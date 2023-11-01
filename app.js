const express = require('express');
const app = express();
const port = 3000; // 你可以選擇自己的伺服器端口號

// 定義路由
app.get('/', (req, res) => {
  res.redirect('/shortener');
});

app.get('/shortener', (req, res) => {
  res.send('Welcome to URL shortener!');
});

app.get('/shortener/:id', (req, res) => {
  const id = req.params.id
  res.send(`URL id: ${id}`)
})

// 啟動伺服器
app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});