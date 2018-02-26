var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var csurf = require('csurf');
var csrfProtection = csurf({cookie: true});
require('dotenv').config();
router.get('/', csrfProtection, function (req, res) {
  console.log(process.env.gmailUser);
  res.render('contact', {csrfToken: req.csrfToken()});
});
router.get('/review', function (req, res) {
  res.render('contactReview');
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
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      return console.log(err);
    }
    res.redirect('review');
  });
});
module.exports = router;
