const express = require('express');
const { engine } = require('express-handlebars') //使用express-handlebars
const app = express();
const port = 3000;
const URLs = require('./public/jsons/URL.json') //使用'./public/jsons/URL.json'
const fs = require('fs'); //使用file system

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
  let originalURL = req.query.inputOriginalURL?.trim();
  let URL = {}

  if (originalURL) {

    // 例外處理：輸入相同網址時，產生一樣的縮址
    if (URLs.some((URL) => URL.originalURLJson === originalURL)) {
      URL = URLs.find((URL) => URL.originalURLJson === originalURL)
      res.render('copy', { URL }); // copy.hbs要render動態資料
    }

    else {
      // 產生id
      let id = generateRandomCode(5);

      // 將originalURL, id存入json中
      URL.originalURLJson = originalURL
      URL.idJson = id
      URLs.push(URL);

      writeJsonToFile('./public/jsons/URL.json', URLs);

      res.render('copy', { URL }); // copy.hbs要render動態資料
    }
  } else {
    // 例外處理：若使用者沒有輸入內容，就按下了送出鈕，需要防止表單送出並提示使用者
    if (originalURL === '') {
      // 用<script></script>包起來的是在client端執行JavaScript內容：alert彈窗，及重新導向"/shortener"路徑
      res.send('<script>alert("未輸入內容，請檢查！"); window.location.href = "/shortener";</script>');
      return
    }
    // originalURL undefined
    res.render('index');
  }
});

// 產生id：一組5碼亂數
function generateRandomCode(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomCode = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomCode += characters.charAt(randomIndex);
  }

  return randomCode;
}

// 將input資料以json檔儲存
function writeJsonToFile(filePath, data) {
  // 將物件轉為 JSON 字串
  const jsonData = JSON.stringify(data);

  // 寫入 JSON 字串到文件
  fs.writeFile(filePath, jsonData, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Write complete!');
    }
  });
}

// id要被redirect到originalURL
app.get('/shortener/:id', (req, res) => {
  let redirectId = req.params.id
  let redirectURLs = URLs.find((URL) => URL.idJson.toString() === redirectId)
  res.redirect(redirectURLs.originalURLJson)
})

// 啟動伺服器
app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});