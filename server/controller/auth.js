const { emailAuthQuery } = require("../model/auth");
const { hash, emailUidQueryCommon } = require("../middleware/common");

// 이메일 인증 컨트롤러
async function emailAuthController(req, res, next) {
  const { email } = req.body;
  const userInfo = await emailUidQueryCommon(email);
  const user = userInfo.toJSON();
  const emailCodeAuthHash = hash(user.uid + email);
  const result = await emailAuthQuery(user.objectId, emailCodeAuthHash, email);
  next(result);
}
module.exports = {
  emailAuthController,
};
