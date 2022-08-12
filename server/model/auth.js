const Parse = require("parse/node");
const config = require("../config");
const {
  // 이메일 인증 완료
  emailAuthSuccess,
  // 그외
  errorCode,
} = require("../res_code/code");

Parse.initialize(
  config.parseAppId,
  config.parseJavascriptKey,
  config.parseMasterKey
);
Parse.serverURL = config.parseServerURL;
Parse.User.enableUnsafeCurrentUser();

const Auth = Parse.Object.extend("auth");
const auth = new Auth();

// 유저 회원가입
async function emailAuthQuery(uid, emailCodeAuthHash) {
  auth.set("auth_id", uid);
  auth.save();
  console.log("emailCodeAuthHash : ", emailCodeAuthHash);
  return emailAuthSuccess;
}

module.exports = {
  emailAuthQuery, // 이메일 인증 쿼리
};
