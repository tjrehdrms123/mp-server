const Parse = require("parse/node");
const config = require("../config");
const {
  // 회원가입 에러
  signUpSuccess,
  idDuplicate,
  emailDuplicate,
  // 로그인 에러
  idNotfound,
  passwordNotfound,
  loginSuccess,
  infoNotfound,
  // 그외
  errorCode,
} = require("../res_code/code");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middleware/jwt");

Parse.initialize(
  config.parseAppId,
  config.parseJavascriptKey,
  config.parseMasterKey
);
Parse.serverURL = config.parseServerURL;
Parse.User.enableUnsafeCurrentUser();

const User = Parse.Object.extend("user");
const user = new User();
// 유저 회원가입 id, email 중복 체크
const idQry = new Parse.Query(User);
const emailQry = new Parse.Query(User);

// 유저 로그인
const userLoginQry = new Parse.Query(User);

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
    user.set("delete_status", false);
    user.set("member_level", 0);
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

// 유저 로그인
async function loginQuery(uid, password, passwordHash) {
  userLoginQry.equalTo("uid", uid);
  const userLogin = await userLoginQry.first();
  const userInfo = userLogin?.toJSON();
  try {
    if (!uid) {
      return idNotfound;
    }
    if (!password) {
      return passwordNotfound;
    }
    if (uid && password) {
      if (passwordHash === userInfo?.password) {
        // DB에 있는 해시 패스워드랑 입력한 비밀번호의 해쉬 값이 같을 경우 토큰 생성
        let accessToken = generateAccessToken(uid);
        let refreshToken = generateRefreshToken(passwordHash);
        loginSuccess.data.accessToken = accessToken;
        loginSuccess.data.refreshToken = refreshToken;
        return loginSuccess;
      } else {
        return infoNotfound;
      }
    }
  } catch (error) {
    errorCode.data.content = error.message;
    return errorCode;
  }
}

module.exports = {
  signUpQuery,
  loginQuery,
};
