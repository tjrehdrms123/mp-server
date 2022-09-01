const { emailAuthQuery } = require("../model/auth");
const { hash } = require("../middleware/common");
const { emailFirstUserQuery } = require("../model/user");

// 이메일 인증 컨트롤러
async function emailAuthController(req, res, next) {
  const { email } = req.body;
  const userInfo = await emailFirstUserQuery(email);
  const emailCodeAuthHash = hash(userInfo[0]?.uid + email);
  const result = await emailAuthQuery(
    userInfo[0]?.objectId,
    emailCodeAuthHash,
    email
  );
  next(result);
}
module.exports = {
  emailAuthController,
};
