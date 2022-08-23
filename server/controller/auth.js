const { emailAuthQuery } = require("../model/auth");
const { emailUidQuery, signUpPassportQuery } = require("../model/user");
const { hash } = require("../middleware/common");

// 이메일 인증 컨트롤러
async function emailAuthController(req, res, next) {
  const { email } = req.body;
  const userInfo = await emailUidQuery(email);
  const user = userInfo.toJSON();
  const emailCodeAuthHash = hash(user.uid + email);
  const result = await emailAuthQuery(user.objectId, emailCodeAuthHash, email);
  next(result);
}

module.exports = {
  emailAuthController,
};
