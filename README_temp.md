# temp

## connect-flash - 資料暫存設計

[https://github.com/jaredhanson/connect-flash](https://github.com/jaredhanson/connect-flash)

即時傳送訊息所用的，類似驗證與訊息用後端來處理，只要使用過一次就會把暫存訊息給刪除掉。

```javascript
// app.js

// ...
var session = require('express-session');
var flash = require('connect-flash');
// ...
app.use(session({
  secret: 'mysupercat',
  resave: true, // 儲存記憶體的機制
  saveUninitialized: true
}));
app.use(flash());
```

```javascript
// routes/contact.js

// ...
router.get('/', csrfProtection, function (req, res) {
  console.log(process.env.gmailUser);
  res.render('contact', {
    csrfToken: req.csrfToken(),
    errors: req.flash('errors')
  });
});
router.post('/post', csrfProtection, function (req, res) {
  if (req.body.username === '') {
    req.flash('errors', '姓名不可為空');
    res.redirect('/contact');
  }
  // ...
});
```

```html
<form action="/contact/post" method="post">
    <input type="hidden" name="_csrf" value="<%= csrfToken %>">

    <h1>聯絡我們</h1>
    <%= errors %>
```

## 還能如何優化？

我們學了什麼？

- mail 發送
- 訊息提示
- 資料隱藏
- 框站攻擊

還能研究

- 自行研究一個 NPM (express-validator)
- 整合 firebase 資料庫，post 時順便儲存
- 新增一個管理者頁，可看到訪客預約的列表
- 看完最後面 heroku 部署章節，試著上傳此功能
