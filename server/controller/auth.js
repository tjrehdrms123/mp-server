const { emailAuthQuery } = require("../model/auth");
const { hash } = require("../middleware/common");
const { isUserQuery } = require("../model/user");

// 이메일 인증 컨트롤러
async function emailAuthController(req, res, next) {
  try {
    const { email } = req.body;
    const userInfo = await isUserQuery(email);
    const emailCodeAuthHash = hash(userInfo?.uid + email);
    const result = await emailAuthQuery(
      userInfo?.objectId,
      emailCodeAuthHash,
      email
    );
    next(result);
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}
module.exports = {
  emailAuthController,
};
