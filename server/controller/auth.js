const { emailAuthQuery } = require("../model/auth");
const { emailUidQuery } = require("../model/user");
const { hash } = require("../middleware/common");
const passport = require("passport");

// 이메일 인증 컨트롤러
async function emailAuthController(req, res, next) {
  const { email } = req.body;
  const uid = await emailUidQuery(email);
  const emailCodeAuthHash = hash(uid + email);
  const result = await emailAuthQuery(uid, emailCodeAuthHash, email);
  next(result);
}

function passportKakao() {
  passport.authenticate("kakao", {
    accessType: "offline",
    prompt: "consent",
  });
}

module.exports = {
  emailAuthController,
  passportKakao,
};
