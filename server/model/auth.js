const Parse = require("parse/node");
require("dotenv").config();
const {
  // 이메일 인증 완료
  emailAuthSuccess,
  // 이메일 인증 실패
  emailAuthFail,
  // 그외
  errorCode,
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

// 유저 회원가입
async function emailAuthQuery(uid, emailCodeAuthHash, email) {
  const userInfo = await equalToQuery(Auth, ["auth_id"], [uid]);
  if (userInfo[0]?.uid) {
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
      emailAuthSuccess.data.message = "이메일 인증이 완료되었습니다";
      return emailAuthSuccess;
    } catch (error) {
      errorCode.data.message = error;
      return errorCode;
    }
  } else {
    try {
      const auth = new Auth();
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
