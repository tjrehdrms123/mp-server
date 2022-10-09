const nodemailer = require("nodemailer");
require("dotenv").config();

/**
 * @description 보낼 이메일과 인증 코드를 받아 인증 메일을 보내주는 함수
 * @param {string} toEmail
 * @param {string} emailCodeAuthHash
 */
async function mailer(toEmail = "", emailCodeAuthHash) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.MAILERHOST,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAILERUSER, // generated ethereal user
      pass: process.env.MAILERPASS, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.MAILERUSER, // sender address
    to: toEmail, // list of receivers
    subject: "[My Map] 회원가입 인증 메일 입니다", // Subject line
    // text: "text", // plain text body
    html: `<p>인증 코드 입니다 : ${emailCodeAuthHash}</p>`, // html body, text보다 우선 순위가 더 높다
  });
  console.log(`response : ${info.response}`);
}

module.exports = {
  mailer,
};
