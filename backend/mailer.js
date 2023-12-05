const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

function createMailOption(opt) {
  const { to, name, subject, html } = opt;
  return {
    from: {
      name: name,
      address: process.env.EMAIL,
    },
    to: to,
    subject: subject,
    html: html,
  };
}

module.exports = { transporter, createMailOption };
