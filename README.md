# mail_service

node index.js

Run at 3001 port

POST /

request JSON

.env
MAIL_USER=test@totest.com
MAIL_PASS=password
MAIL_FROM=
MAIL_SERVICE=gmail


example:
{
    "to":"test@totest.com",
    "cc":"test@cctest.com",
    "subject":"Test Mail",
    "text":"Test mail text",
    "html":"<b>Test mail html</b>"
    }

response:
{
    success: true,
    info: ""
}
