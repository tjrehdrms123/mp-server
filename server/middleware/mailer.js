const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function mailer(toEmail = "", emailCodeAuthHash) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: config.mailerHost,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.mailerUser, // generated ethereal user
      pass: config.mailerPass, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: config.mailerUser, // sender address
    to: toEmail, // list of receivers
    subject: "[Mom Page] 회원가입 인증 메일 입니다", // Subject line
    // text: "text", // plain text body
    html: `<p>인증 코드 입니다 : ${emailCodeAuthHash}</p>`, // html body, text보다 우선 순위가 더 높다
  });
  console.log(`response : ${info.response}`);
}

module.exports = {
  mailer,
};
