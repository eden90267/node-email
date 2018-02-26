# 電子郵件 - Node.js

## 環境準備

[低安全性應用程式](https://myaccount.google.com/lesssecureapps?pli=1)

將它打勾起來，才可以使用 Node.js 寄發信件

## Nodemailer - 發信功能介接

解決許多底層問題，方便我們去寄信。只要告訴它基礎資訊，就可以依照它方法去寄信。

```shell
npm i nodemailer --save
```

1. Create a Nodemailer transporter using either SMTP or some other transport mechanism
2. Set up message options (who sends what to whom)
3. Deliver the message object using the sendMail() method of your previously created transporter

官網 Example：

```javascript
'use strict';
const nodemailer = require('nodemailer');

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: account.user, // generated ethereal user
            pass: account.pass // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: 'bar@example.com, baz@example.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
});
```

以下是實際實作範例程式碼：

```javascript
// routes/contact.js

var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
router.get('/', function (req, res) {
  res.render('contact');
});
router.get('/review', function (req, res) {
  res.render('contactReview');
});
router.post('/post', function (req, res) {
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: '',
      pass: ''
    }
  });
  var mailOptions = {
    from: '"劉育廷" <eden90267@gmail.com>',
    to: 'eden90267@gmail.com,',
    subject: req.body.username + '寄了一封信',
    text: req.body.description
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      return console.log(error);
    }
    res.redirect('review');
  });
});
module.exports = router;
```

## CSRF - 跨站請求偽造

設計上一定要在瀏覽器上面進行行為，其他的會進行抵擋機制阻止。這樣即可安心服務不被入侵攻擊。

## CSURF - 阻擋跨站攻擊

一個 npm 套件，express 內建為一個 middleware，可參閱 [Github](https://github.com/expressjs/csurf)。

機制是沒有夾帶 csrf 的 cookie，就沒辦法傳送過去。

```javascript
// routes/contact.js

var csurf = require('csurf');
var csrfProtection = csurf({cookie: true});
// ...
router.get('/', csrfProtection, function (req, res) {
  res.render('contact', {csrfToken: req.csrfToken()});
});
// ...
router.post('/post', csrfProtection, function (req, res) {
  //...
});
```

```html
<form action="/contact/post" method="post">
    <input type="hidden" name="_csrf" value="<%= csrfToken %>">

    <h1>聯絡我們</h1>
    <!--...-->
</form>
```

## dotenv - 環境變數設定

保護重要資料被隱藏起來，儲存在 .env 檔案裡面

```
// .env

gmailUser = 
gmailPass = 
```

```javascript
// routes/contact.js

// ...
require('dotenv').config();
router.get('/', csrfProtection, function (req, res) {
  console.log(process.env.gmailUser);
  res.render('contact', {csrfToken: req.csrfToken()});
});
router.post('/post', csrfProtection, function (req, res) {
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.gmailUser,
      pass: process.env.gmailPass
    }
  });
  var mailOptions = {
    from: '"劉育廷" <eden90267@gmail.com>',
    to: 'eden90267@gmail.com,',
    subject: req.body.username + '寄了一封信',
    text: req.body.description
  };
  // ...
  });
```