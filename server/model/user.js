const Parse = require("parse/node");
require("dotenv").config();
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
  emailAuthCodeNotfound,
  authTypeNotfound,
  emailAuthCodeFail,
  // 그외
  loginToken, //로그인 리프래쉬 토큰
  errorCode,
} = require("../res_code/code");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middleware/jwt");

Parse.initialize(
  process.env.PARSEAPPID,
  process.env.PARSEJAVASCRIPTKEY,
  process.env.PARSEMASTERKEY
);
Parse.serverURL = process.env.PARSESSERVERURL;
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
  const userFirst = await userQry.first();
  const userInfo = userFirst?.toJSON();
  console.log("A: ", userInfo);
  if (userInfo?.uid === uid) {
    console.log("uid");
    idDuplicate.data.uid = uid;
    return idDuplicate;
  }
  console.log("B: ", userInfo);
  console.log(userInfo?.email);
  console.log(email);
  if (userInfo?.email === email) {
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
async function loginQuery(
  uid,
  password,
  passwordHash,
  auth_type,
  email_auth_code
) {
  userQry.equalTo("uid", uid);
  const userFirst = await userQry.first();
  const userInfo = userFirst?.toJSON();
  // 자체 로그인
  if (auth_type === 0) {
    try {
      if (!uid) {
        return idNotfound;
      }
      if (!password) {
        return passwordNotfound;
      }
      if (!email_auth_code) {
        return emailAuthCodeNotfound;
      } else if (email_auth_code != userInfo?.email_auth_code) {
        return emailAuthCodeFail;
      }
      if (uid && password) {
        if (passwordHash === userInfo?.password) {
          // DB에 있는 해시 패스워드랑 입력한 비밀번호의 해쉬 값이 같을 경우 토큰 생성
          let accessToken = generateAccessToken({
            uid: userInfo?.uid,
            password: userInfo.password,
          });
          let refreshToken = generateRefreshToken({
            uid: userInfo?.uid,
            password: userInfo?.password,
          });
          loginSuccess.data.message = "로그인이 완료되었습니다";
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
  } else if (auth_type === 1 || auth_type === 2) {
    // Kakao 로그인
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
          let accessToken = generateAccessToken({
            uid: userInfo?.uid,
            password: userInfo.password,
          });
          let refreshToken = generateRefreshToken({
            uid: userInfo?.uid,
            password: userInfo?.password,
          });
          loginSuccess.data.accessToken = accessToken;
          loginSuccess.data.refreshToken = refreshToken;
          loginSuccess.data.message = "로그인이 완료되었습니다";
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
  } else if (auth_type === 3) {
    //JWT
    if (uid && password) {
      if (password === userInfo?.password) {
        // DB에 있는 해시 패스워드랑 입력한 비밀번호의 해쉬 값이 같을 경우 토큰 생성
        let accessToken = generateAccessToken({
          uid: userInfo?.uid,
          password: userInfo?.password,
        });
        let refreshToken = generateRefreshToken({
          uid: userInfo?.uid,
          password: userInfo?.password,
        });
        loginSuccess.data.accessToken = accessToken;
        loginSuccess.data.refreshToken = refreshToken;
        loginSuccess.data.message = "새로운 토큰이 발급 되었습니다";
        loginToken.data.refreshToken = refreshToken;
        loginToken.data.sameSite = "none";
        loginToken.data.secure = true;
        loginToken.data.httpOnly = true;
        return [loginSuccess, loginToken];
      } else {
        return infoNotfound;
      }
    }
  } else if (!auth_type) {
    return authTypeNotfound;
  }
}

async function emailFirstUserQuery(email) {
  userQry.equalTo("email", email);
  const userFirst = await userQry.first();
  return userFirst;
}

// passport
async function signUpPassportQuery(uid, name, email, auth_type, passwordHash) {
  userQry.equalTo("uid", uid);
  const userFirst = await userQry.first();
  const userInfo = userFirst?.toJSON();
  const provider = auth_type === 1 ? "kakao" : "google";
  if (userInfo?.uid === uid) {
    idDuplicate.data.uid = uid;
    return idDuplicate;
  }
  try {
    user.set("uid", uid);
    user.set("name", name);
    user.set("email", email);
    user.set("password", passwordHash);
    user.set("delete_status", false);
    user.set("member_level", 0);
    user.set("auth_type", auth_type);
    user.set("email_auth_code", "");
    await user.save();
    signUpSuccess.data.objectId = user.id;
    signUpSuccess.data.uid = uid;
    signUpSuccess.data.name = name;
    signUpSuccess.data.email = email;
    signUpSuccess.data.auth_type = auth_type;
    signUpSuccess.data.provider = provider;
    return signUpSuccess;
  } catch (error) {
    errorCode.data.message = error;
    return errorCode;
  }
}

module.exports = {
  signUpQuery,
  loginQuery,
  emailFirstUserQuery,
  signUpPassportQuery,
};
