const { emailAuthQuery } = require("../model/auth");
const { hash } = require("../middleware/common");
const { isUserQuery } = require("../model/user");
const { requestErrorCode } = require("../res_code/code");

/**
 * 이메일 인증
 * @param {object} req - { email }
 * @param {object} res
 * @param {function} next
 * @returns {Promise}
 */
async function emailAuthController(req, res, next) {
  try {
    const { email } = req.body;
    if (!email){
      requestErrorCode.data.message = "이메일이 없습니다.";
      return requestErrorCode;
    }
    // 이메일에 해당하는 유저 가져오기
    const userInfo = await isUserQuery(email);
    /**
     * 이메일 인증 코드 암호화
     * - 회원가입때에 동일하게 암호화를 진행했기때문에 해당 형식으로 암호화
    */
    const emailCodeAuthHash = hash(userInfo?.uid + email);
    // 이메일 전송
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
