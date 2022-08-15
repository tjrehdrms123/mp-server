const { emailAuthQuery } = require("../model/auth");
const { emailUidQuery } = require("../model/user");
const { hash } = require("../middleware/common");

// 이메일 인증 컨트롤러
async function emailAuthController(req, res, next) {
  const { email, auth_type } = req.body;
  const uid = await emailUidQuery(email);
  const emailCodeAuthHash = hash(uid + email);
  const result = await emailAuthQuery(uid, emailCodeAuthHash, email);
  next(result);
}

module.exports = {
  emailAuthController,
};
