const Parse = require("parse/node");
require("dotenv").config();
const {
  successCode,
  // 그외
  errorCode,
  requestErrorCode,
} = require("../res_code/code");
const { mailer } = require("../middleware/mailer");
const { equalToQuery } = require("../middleware/common");

Parse.initialize(
  process.env.PARSEAPPID,
  process.env.PARSEJAVASCRIPTKEY,
  process.env.PARSEMASTERKEY
);
Parse.serverURL = process.env.PARSESERVERURL;
Parse.User.enableUnsafeCurrentUser();

const Auth = Parse.Object.extend("auth");

/**
 * 이메일 전송
 * @param {objectId} uid - 유저 ID
 * @param {string} emailCodeAuthHash - 이메일 인증 코드
 * @param {email} email - 유저 Email
 * @returns {successCode|errorCode} - 성공 시 successCode, 실패 시 errorCode
 */
async function emailAuthQuery(uid, emailCodeAuthHash, email) {
  try {
    const userInfo = await equalToQuery(Auth, ["auth_id"], [uid]);
    if (userInfo[0]?.uid) {
      /*
      TODO: 추후 개선이 필요해보임
      프로세스 : 회원가입 -> 이메일 인증 발송 -> 인증 코드 가지고 로그인

      emailAuthQuery API를 호출할때 새로운 user를 생성하는 이슈가 있어서
      user테이블에 유저가 있다면 해당 유저 auth행에 업데이트 즉 patch(업데이트), post(생성) 두가지의 기능을 지원
    */
      const authIdDuplicate = await authQry.first("auth_id", uid);
      authIdDuplicate.set("auth_id", {
        __type: "Pointer",
        className: "user",
        objectId: uid,
      });
      authIdDuplicate.save();
      mailer(email, emailCodeAuthHash).catch(console.error);
      successCode.data.message = "이메일 인증 코드가 전송되었습니다.";
      return successCode;
    } else {
      const auth = new Auth();
      auth.set("auth_id", {
        __type: "Pointer",
        className: "user",
        objectId: uid,
      });
      auth.save();
      mailer(email, emailCodeAuthHash).catch(console.error);
      successCode.data.message = "이메일 인증 코드가 전송되었습니다.";
      return successCode;
    }
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}

module.exports = {
  emailAuthQuery, // 이메일 인증 쿼리
};
