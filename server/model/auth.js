const Parse = require("parse/node");
const config = require("../config");
const {
  // 이메일 인증 완료
  emailAuthSuccess,
  // 이메일 인증 실패
  emailAuthFail,
  // 그외
  errorCode,
} = require("../res_code/code");
const { mailer } = require("../middleware/mailer");

Parse.initialize(
  config.parseAppId,
  config.parseJavascriptKey,
  config.parseMasterKey
);
Parse.serverURL = config.parseServerURL;
Parse.User.enableUnsafeCurrentUser();

const Auth = Parse.Object.extend("auth");
const auth = new Auth();
const authQry = new Parse.Query(Auth);

// 유저 회원가입
async function emailAuthQuery(uid, emailCodeAuthHash, email) {
  const authIdCheck = await authQry.first("auth_id", uid);
  if (authIdCheck) {
    /*
      emailAuthQuery API를 호출할때 새로운 user를 생성하는 이슈가 있어서
      user테이블에 유저가 있다면 해당 유저 auth행에 업데이트 즉 patch(업데이트), post(생성) 두가지의 기능을 지원 
    */
    try {
      const authIdDuplicate = await authQry.first("auth_id", uid);
      authIdDuplicate.set("auth_id", {
        __type: "Pointer",
        className: "user",
        objectId: uid,
      });
      authIdDuplicate.save();
      mailer(email, emailCodeAuthHash).catch(console.error);
      emailAuthSuccess.data.message = "이메일 재인증이 완료되었습니다";
      return emailAuthSuccess;
    } catch (error) {
      errorCode.data.message = error;
      return errorCode;
    }
  } else {
    try {
      auth.set("auth_id", {
        __type: "Pointer",
        className: "user",
        objectId: uid,
      });
      auth.save();
      mailer(email, emailCodeAuthHash).catch(console.error);
      emailAuthSuccess.data.message = "이메일 인증이 완료되었습니다";
      return emailAuthSuccess;
    } catch (error) {
      errorCode.data.message = error;
      return errorCode;
    }
  }
}

module.exports = {
  emailAuthQuery, // 이메일 인증 쿼리
};
