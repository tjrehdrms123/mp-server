const Parse = require("parse/node");
const config = require("../config");
const {
  // 이메일 인증 완료
  emailAuthSuccess,
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
    //authId 같음
    const authIdDuplicate = await authQry.first("auth_id", uid);
    authIdDuplicate.set("auth_id", uid);
    authIdDuplicate.save();
    mailer(email, emailCodeAuthHash).catch(console.error);
    return emailAuthSuccess;
  } else {
    auth.set("auth_id", uid);
    auth.save();
    mailer(email, emailCodeAuthHash).catch(console.error);
    return emailAuthSuccess;
  }
}

module.exports = {
  emailAuthQuery, // 이메일 인증 쿼리
};
