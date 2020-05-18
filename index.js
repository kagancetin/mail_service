var express = require("express");
var nodemailer = require("nodemailer");
var bodyParser = require("body-parser");
var logger = require("morgan");
var fs = require("fs");

var app = express();

//middlewares
app.use(bodyParser.json());
app.use(logger("dev"));

var mail_options;

fs.readFile("mail_options.json", function (err, data) {
  mail_options = JSON.parse(data);
  console.log(mail_options);
});

app.post("/", async function (req, res) {
  console.log("sonuc", req.body);
  let transporter = nodemailer.createTransport({
    host: mail_options.host,
    port: mail_options.port,
    secure: mail_options.secure, // true for 465, false for other ports
    auth: {
      user: mail_options.auth.user, // generated ethereal user
      pass: mail_options.auth.pass, // generated ethereal password
    },
  });
  try {
    let info = await transporter.sendMail({
      from: mail_options.from,
      to: req.body.to,
      cc: req.body.cc,
      subject: req.body.subject,
      text: req.body.text,
      html: req.body.html,
    });
    res.send({
      success: true,
      info: "Message sent. Message ID: " + info.messageId,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    res.send({
      success: false,
      info: error,
    });
  }
});

const port = app.get("port") || 3001;
app.listen(port, () =>
  console.log("Mail Service is listenning on port " + port)
);
