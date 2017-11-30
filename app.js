const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

//View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

//Body Parser Middleware
app.use(bodyParser.urlencoded({ entended: false}));
app.use(bodyParser.json());

app.get('/',(req,res)=>{
  res.render('contact');
});

app.post('/send',(req, res)=>{
  const output = `
    <h3>Email has been sent through Emailable.</h3>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.mail.yahoo.com.tw',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: req.body.email, // generated ethereal user
        pass: req.body.password  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: req.body.name + ' <' + req.body.email + '>', // sender address
      to: JSON.stringify(req.body.emailto),  // list of receivers
      subject: JSON.stringify(req.body.topic), // Subject line
      text: 'Hello world', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      res.render('send', {msg:'Email has been sent...Please wait.'});
  });
});

app.listen(3000, () => console.log('Server Started'));
