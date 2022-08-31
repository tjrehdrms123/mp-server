const { emailAuthQuery } = require("../model/auth");
const { hash } = require("../middleware/common");
const { emailFirstUserQuery } = require("../model/user");

// 이메일 인증 컨트롤러
async function emailAuthController(req, res, next) {
  const { email } = req.body;
  const userFirst = await emailFirstUserQuery(email);
  const userInfo = userFirst?.toJSON();
  const emailCodeAuthHash = hash(userInfo.uid + email);
  const result = await emailAuthQuery(
    userInfo?.objectId,
    emailCodeAuthHash,
    email
  );
  next(result);
}
module.exports = {
  emailAuthController,
};
