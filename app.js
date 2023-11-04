const express = require('express');
const { engine } = require('express-handlebars') //使用express-handlebars
const app = express();
const port = 3000; // 你可以選擇自己的伺服器端口號
const URLs = require('./public/jsons/URL.json') //使用test data

// 把樣板引擎交給express-handlebars
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

// 呼叫所需靜態檔案
app.use(express.static('public'))

// 定義路由
app.get('/', (req, res) => {
  res.redirect('/shortener');
});

app.get('/shortener', (req, res) => {
  res.render('index');
});

app.get('/shortener/:id', (req, res) => {
  const id = req.params.id
  res.send(`URL id: ${id}`)
})

// 啟動伺服器
app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});