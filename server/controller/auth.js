const { emailAuthQuery } = require("../model/auth");
const { emailUidQuery } = require("../model/user");
const { hash } = require("../middleware/common");

// 이메일 인증 컨트롤러
async function emailAuthController(req, res, next) {
  const { email, auth_type, email_auth_code } = req.body;
  const emailCodeAuthHash = hash(email_auth_code);
  const uid = await emailUidQuery(email);
  const result = await emailAuthQuery(uid, emailCodeAuthHash);
  next(result);
}

module.exports = {
  emailAuthController,
};
