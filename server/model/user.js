const Parse = require("parse/node");
const config = require("../config");
const {
  signUpSuccess,
  idDuplicate,
  emailDuplicate,
  errorCode,
} = require("../res_code/code");

Parse.initialize(
  config.parseAppId,
  config.parseJavascriptKey,
  config.parseMasterKey
);
Parse.serverURL = config.parseServerURL;
Parse.User.enableUnsafeCurrentUser();

const User = Parse.Object.extend("user");
const user = new User();
// id, email 중복 체크
const idQry = new Parse.Query(User);
const emailQry = new Parse.Query(User);

// 유저 회원가입
async function signUpQuery(uid, name, email, passwordHash, verify_type) {
  idQry.equalTo("uid", uid);
  emailQry.equalTo("email", email);
  const idCheck = await idQry.first();
  const emailCheck = await emailQry.first();
  if (idCheck) {
    idDuplicate.data.uid = uid;
    return idDuplicate;
  }
  if (emailCheck) {
    emailDuplicate.data.email = email;
    return emailDuplicate;
  }
  try {
    user.set("uid", uid);
    user.set("name", name);
    user.set("email", email);
    user.set("password", passwordHash);
    user.set("verify_type", verify_type);
    await user.save();
    signUpSuccess.data.objectId = user.id;
    signUpSuccess.data.uid = uid;
    signUpSuccess.data.name = name;
    signUpSuccess.data.email = email;
    return signUpSuccess;
  } catch (error) {
    errorCode.data = error;
    return errorCode;
  }
}

module.exports = {
  signUpQuery,
};
