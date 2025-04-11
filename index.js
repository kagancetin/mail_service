var express = require("express");
var nodemailer = require("nodemailer");
var morgan = require("morgan");
var fs = require("fs").promises;

var app = express();

// middlewares
app.use(express.json());  // body-parser yerine express.json() kullanıyoruz
app.use(morgan("dev"));

let mail_options;

async function loadMailOptions() {
  try {
    const data = await fs.readFile("mail_options.json", "utf-8");
    mail_options = JSON.parse(data);
    console.log(mail_options);
  } catch (err) {
    console.error("Error reading mail_options.json:", err);
  }
}

loadMailOptions();

app.post("/", async function (req, res) {
  console.log("sonuç", req.body);

  let transporter = nodemailer.createTransport({
    service: "gmail",  // Gmail'i kullanacağımızı belirtiyoruz
    auth: {
      user: mail_options.auth.user,
      pass: mail_options.auth.pass,
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

const port = process.env.PORT || 3001;
app.listen(port, () =>
  console.log(`Mail Service is listening on port ${port}`)
);
