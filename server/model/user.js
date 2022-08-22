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
  loginToken, //로그인 리프래쉬 토큰
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
const userQry = new Parse.Query(User);

// 유저 회원가입
async function signUpQuery(
  uid,
  name,
  email,
  passwordHash,
  emailCodeAuthHash,
  auth_type
) {
  userQry.equalTo("uid", uid);
  userQry.equalTo("email", email);
  const idCheck = await userQry.first();
  const emailCheck = await userQry.first();
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
    user.set("delete_status", false);
    user.set("member_level", 0);
    user.set("auth_type", auth_type);
    user.set("email_auth_code", emailCodeAuthHash);
    await user.save();
    signUpSuccess.data.objectId = user.id;
    signUpSuccess.data.uid = uid;
    signUpSuccess.data.name = name;
    signUpSuccess.data.email = email;
    signUpSuccess.data.auth_type = auth_type;
    return signUpSuccess;
  } catch (error) {
    errorCode.data.message = error;
    return errorCode;
  }
}

// 유저 로그인
async function loginQuery(uid, password, passwordHash, auth_type) {
  userQry.equalTo("uid", uid);
  const userLogin = await userQry.first();
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
        loginToken.data.refreshToken = refreshToken;
        loginToken.data.sameSite = "none";
        loginToken.data.secure = true;
        loginToken.data.httpOnly = true;
        return [loginSuccess, loginToken];
      } else {
        return infoNotfound;
      }
    }
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}

async function emailUidQuery(email) {
  userQry.equalTo("email", email);
  const uid = await userQry.first();
  return uid;
}

// passport
async function signUpPassportQuery(uid, name, email, auth_type) {
  userQry.equalTo("uid", uid);
  const idCheck = await userQry.first();
  console.log("uid", uid);
  console.log("name", name);
  console.log("email", email);
  console.log("auth_type", auth_type);
  if (idCheck) {
    idDuplicate.data.uid = uid;
    return idDuplicate;
  }
  try {
    user.set("uid", uid);
    user.set("name", name);
    user.set("email", email);
    user.set(
      "password",
      "44fa35b41dbe1199e8a41307ab9d1dd541fe64d9a656d8e07efc7e21488ef5e8"
    );
    user.set("delete_status", false);
    user.set("member_level", 0);
    user.set("auth_type", auth_type);
    user.set(
      "email_auth_code",
      "44fa35b41dbe1199e8a41307ab9d1dd541fe64d9a656d8e07efc7e21488ef5e8"
    );
    await user.save();
    signUpSuccess.data.objectId = user.id;
    signUpSuccess.data.uid = uid;
    signUpSuccess.data.name = name;
    signUpSuccess.data.email = email;
    signUpSuccess.data.auth_type = auth_type;
    signUpSuccess.data.provider = "kakao";
    return signUpSuccess;
  } catch (error) {
    errorCode.data.message = error;
    return errorCode;
  }
}

module.exports = {
  signUpQuery,
  loginQuery,
  emailUidQuery,
  signUpPassportQuery,
};
