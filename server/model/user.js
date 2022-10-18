const Parse = require("parse/node");
require("dotenv").config();
const {
  successCode,
  loginToken,
  requestErrorCode,
  successTokenCode,
  errorCode,
} = require("../res_code/code");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middleware/jwt");
const { equalToQuery, emailCheck } = require("../middleware/common");

Parse.initialize(
  process.env.PARSEAPPID,
  process.env.PARSEJAVASCRIPTKEY,
  process.env.PARSEMASTERKEY
);
Parse.serverURL = process.env.PARSESSERVERURL;
Parse.User.enableUnsafeCurrentUser();

const User = Parse.Object.extend("user");

// 유저 회원가입
async function signUpQuery(
  uid,
  name,
  email,
  passwordHash,
  emailCodeAuthHash,
  auth_type,
  password
) {
  try {
    if (!uid){
      requestErrorCode.data.message = "아이디가 없습니다";
      return requestErrorCode;
    }
    if (!name){
      requestErrorCode.data.message = "이름이 없습니다";
      return requestErrorCode;
    }
    if (!email){
      requestErrorCode.data.message = "이메일이 없습니다";
      return requestErrorCode;
    }
    if (!password){
      requestErrorCode.data.message = "비밀번호가 없습니다";
      return requestErrorCode;
    }
    if(!emailCheck(email)){
      requestErrorCode.data.message = "이메일 형식에 맞지 않습니다";
      return requestErrorCode;
    }
    const userInfo = await equalToQuery(User, ["uid", "email"], [uid, email]);
    if (userInfo[0]?.uid === uid) {
      requestErrorCode.data.message = "아이디가 이미 존재 합니다";
      requestErrorCode.data.uid = uid;
      return requestErrorCode;
    }
    if (userInfo[1]?.email === email) {
      requestErrorCode.data.message = "이메일이 이미 존재 합니다";
      requestErrorCode.data.email = email;
      return requestErrorCode;
    }
    const user = new User();
    user.set("uid", uid);
    user.set("name", name);
    user.set("email", email);
    user.set("password", passwordHash);
    user.set("delete_status", false);
    user.set("member_level", 0);
    user.set("auth_type", auth_type);
    user.set("email_auth_code", emailCodeAuthHash);
    await user.save();
    successCode.data.objectId = user.id;
    successCode.data.message = "회원가입이 완료 되었습니다";
    successCode.data.uid = uid;
    successCode.data.name = name;
    successCode.data.email = email;
    successCode.data.auth_type = auth_type;
    return successCode;
  } catch (error) {
    errorCode.data.message = error.message;
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
  // 자체 로그인
  try {
    if (!uid){
      requestErrorCode.data.message = "아이디가 없습니다";
      return requestErrorCode;
    }
    if (!password){
      requestErrorCode.data.message = "비밀번호가 없습니다";
      return requestErrorCode;
    }
    if (!email_auth_code){
      requestErrorCode.data.message = "아메일 인증코드가 없습니다";
      return requestErrorCode;
    }
    const userInfo = await equalToQuery(User, ["uid"], [uid]);
    if (auth_type === 0) {
      if (!uid) {
        requestErrorCode.data.message = "아이디를 찾을 수 없습니다";
        return requestErrorCode;
      }
      if (!password) {
        requestErrorCode.data.message = "비밀번호를 찾을 수 없습니다";
        return requestErrorCode;
      }
      if (!email_auth_code) {
        requestErrorCode.data.message = "이메일 인증코드를 찾을 수 없습니다";
        return requestErrorCode;
      } else if (email_auth_code != userInfo[0]?.email_auth_code) {
        requestErrorCode.data.message = "이메일 인증코드가 옳바르지 않습니다";
        return requestErrorCode;
      }
      if (uid && password) {
        if (passwordHash === userInfo[0]?.password) {
          // DB에 있는 해시 패스워드랑 입력한 비밀번호의 해쉬 값이 같을 경우 토큰 생성
          let accessToken = generateAccessToken({
            uid: userInfo[0]?.uid,
            password: userInfo[0].password,
          });
          let refreshToken = generateRefreshToken({
            uid: userInfo[0]?.uid,
            password: userInfo[0]?.password,
          });
          successTokenCode.data.message = "로그인이 완료되었습니다";
          successTokenCode.data.type = "cookie";
          successTokenCode.data.accessToken = accessToken;
          successTokenCode.data.refreshToken = refreshToken;
          successTokenCode.data.objectId = userInfo[0]?.objectId;
          successTokenCode.data.sameSite = "none";
          successTokenCode.data.secure = true;
          successTokenCode.data.httpOnly = true;
          return successTokenCode;
        } else {
          requestErrorCode.data.message = "해당 정보를 찾을 수 없습니다";
          return requestErrorCode;
        }
      }
    } else if (auth_type === 1 || auth_type === 2) {
      // Kakao 로그인
      if (!uid) {
        requestErrorCode.data.message = "아이디를 찾을 수 없습니다";
        return requestErrorCode;
      }
      if (!password) {
        requestErrorCode.data.message = "패스워드를 찾을 수 없습니다";
        return requestErrorCode;
      }
      if (uid && password) {
        if (passwordHash === userInfo[0]?.password) {
          // DB에 있는 해시 패스워드랑 입력한 비밀번호의 해쉬 값이 같을 경우 토큰 생성
          let accessToken = generateAccessToken({
            uid: userInfo[0]?.uid,
            password: userInfo[0].password,
          });
          let refreshToken = generateRefreshToken({
            uid: userInfo[0]?.uid,
            password: userInfo[0]?.password,
          });
          successTokenCode.data.accessToken = accessToken;
          successTokenCode.data.type = "cookie";
          successTokenCode.data.refreshToken = refreshToken;
          successTokenCode.data.message = "로그인이 완료되었습니다";
          successTokenCode.data.sameSite = "none";
          successTokenCode.data.secure = true;
          successTokenCode.data.httpOnly = true;
          return successTokenCode;
        } else {
          requestErrorCode.data.message = "해당 정보를 찾을 수 없습니다";
          return requestErrorCode;
        }
      }
    } else if (auth_type === 3) {
      //JWT
      if (uid && password) {
        if (password === userInfo[0]?.password) {
          // DB에 있는 해시 패스워드랑 입력한 비밀번호의 해쉬 값이 같을 경우 토큰 생성
          let accessToken = generateAccessToken({
            uid: userInfo[0]?.uid,
            password: userInfo[0]?.password,
          });
          let refreshToken = generateRefreshToken({
            uid: userInfo[0]?.uid,
            password: userInfo[0]?.password,
          });
          successTokenCode.data.accessToken = accessToken;
          successTokenCode.data.type = "cookie";
          successTokenCode.data.refreshToken = refreshToken;
          successTokenCode.data.message = "새로운 토큰이 발급 되었습니다";
          successTokenCode.data.sameSite = "none";
          successTokenCode.data.secure = true;
          successTokenCode.data.httpOnly = true;
          return successTokenCode;
        } else {
          requestErrorCode.data.message = "해당 정보를 찾을 수 없습니다";
          return requestErrorCode;
        }
      }
    } else if (!auth_type) {
      requestErrorCode.data.message = "인증 타입을 찾을 수 없습니다";
      return requestErrorCode;
    }
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}

async function isUserQuery(value) {
  try {
    if (!value){
      requestErrorCode.data.message = "잘못된 요청 입니다";
      return requestErrorCode;
    }
    const userInfo = await equalToQuery(User, ["email"], [value]);
    return userInfo[0];
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}

// passport
// async function signUpPassportQuery(uid, name, email, auth_type, passwordHash) {
//   try {
//     if (!uid){
//       requestErrorCode.data.message = "잘못된 요청 입니다";
//       return requestErrorCode;
//     }
//     const userInfo = await equalToQuery(User, ["uid"], [uid]);
//     const provider = auth_type === 1 ? "kakao" : "google";
//     const user = new User();
//     user.set("uid", uid);
//     user.set("name", name);
//     user.set("email", email);
//     user.set("password", passwordHash);
//     user.set("delete_status", false);
//     user.set("member_level", 0);
//     user.set("auth_type", auth_type);
//     user.set("email_auth_code", "");
//     await user.save();
//     successTokenCode.data.objectId = user.id;
//     successTokenCode.data.uid = uid;
//     successTokenCode.data.name = name;
//     successTokenCode.data.email = email;
//     successTokenCode.data.auth_type = auth_type;
//     successTokenCode.data.provider = provider;
//     return successTokenCode;
//   } catch (error) {
//     errorCode.data.message = error.message;
//     return errorCode;
//   }
// }

async function isTokenQuery(token) {
  try {
    if (!token || !token.uid) {
      requestErrorCode.data.message = "토큰이 없습니다";
      return requestErrorCode;
    }
    const userInfo = await equalToQuery(User, ["uid"], [token.uid]);
    if (
      token.uid != userInfo[0].uid ||
      token.password != userInfo[0].password
    ) {
      requestErrorCode.data.message = "옳바르지 않은 토큰 입니다";
      return requestErrorCode;
    }
    if (userInfo[0].objectId) {
      return userInfo[0].objectId;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    errorCode.data.message = error.message;
    return errorCode;
  }
}

module.exports = {
  signUpQuery,
  loginQuery,
  isUserQuery,
  // signUpPassportQuery,
  isTokenQuery,
};
