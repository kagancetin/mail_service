require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const morgan = require("morgan");

const app = express();

// middlewares
app.use(express.json());
app.use(morgan("dev"));

app.post("/", async function (req, res) {
  let transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  try {
    let info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
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

app.post("/send-mail", async function (req, res) {
  let transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  try {
    let info = await transporter.sendMail({
      to: process.env.MAIL_TO,
      from: process.env.MAIL_FROM,
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

const port = process.env.PORT || 3001;
app.listen(port, () =>
  console.log(`Mail Service is listening on port ${port}`)
);
