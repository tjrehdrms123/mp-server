const crypto = require("crypto");
const {
  signUpQuery,
  loginQuery,
  // signUpPassportQuery,
} = require("../model/user");
const { hash } = require("../middleware/common");
// const passport = require("passport");
// const KakaoStrategy = require("passport-kakao").Strategy;
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();
// passport kakao
// passport.use(
//   new KakaoStrategy(
//     {
//       clientID: process.env.PASSPORTKAKAORESTAPIKEY,
//       callbackURL: process.env.PASSPORTKAKAOCALLBACKURL,
//     },
//     async function (accessToken, refreshToken, profile, cb) {
//       let result;
//       const passwordHash = hash(String(profile.id) + profile.provider);
//       try {
//         result = await signUpPassportQuery(
//           String(profile.id),
//           profile.username,
//           profile._json.kakao_account.email,
//           1,
//           passwordHash
//         );
//       } catch (err) {
//         console.log("err :", err);
//       }
//       return cb(null, {
//         ...result,
//         provider: profile.provider,
//       });
//     }
//   )
// );
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.PASSPORTGOOGLECLIENTID,
//       clientSecret: process.env.PASSPORTGOOGLECLINETSECRET,
//       callbackURL: process.env.PASSPORTGOOGLECALLBACKURL,
//     },
//     async function (accessToken, refreshToken, profile, cb) {
//       let result;
//       const passwordHash = hash(String(profile.id) + profile.provider);
//       try {
//         result = await signUpPassportQuery(
//           String(profile.id),
//           String(profile.id),
//           profile._json.email,
//           2,
//           passwordHash
//         );
//       } catch (err) {
//         console.log("err :", err);
//       }
//       return cb(null, {
//         ...result,
//         provider: profile.provider,
//       });
//     }
//   )
// );

// // serializeUser, deserializeUser
// passport.serializeUser(function (user, done) {
//   // router의 req.login 요청이 들어오면 실행된다 필요한 부분만 메모리에 저장하도록함. (여기에서는 id)
//   try{
//     done(null, user.id);
//   } catch(err){
//     console.log('err : ',err.message);
//   }
// });

// passport.deserializeUser(function (user, done) {
//   console.log('A');
//   try{
//     done(null, user);
//   } catch(err){
//     console.log('err : ',err.message);
//   }
// });

// 회원가입 컨트롤러
async function signUpController(req, res, next) {
  try {
    const { uid, name, email, password, auth_type } = req.body;
    // 비밀번호 sha256 알고리즘으로 해시값으로 변경
    const passwordHash = hash(password);
    const emailCodeAuthHash = hash(uid + email);
    const result = await signUpQuery(
      uid,
      name,
      email,
      passwordHash,
      emailCodeAuthHash,
      auth_type,
      password
    );
    next(result);
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}

//로그인 컨트롤러
async function loginController(req, res, next) {  
  try {
    const { uid, password, auth_type, email_auth_code } = req.body;
    const passwordHash = hash(password);
    const result = await loginQuery(
      uid,
      password,
      passwordHash,
      auth_type,
      email_auth_code
    );
    next(result);
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}

// const passportKakao = passport.authenticate("kakao", {
//   accessType: "offline",
//   prompt: "consent",
// });

// const passportKakaoCallBack = passport.authenticate("kakao", {
//   successRedirect: "/",
//   failureRedirect: "/login",
// });

// const passportGoogle = passport.authenticate("google", {
//   scope: ["email"],
//   accessType: "offline",
//   prompt: "consent",
// });

// const passportGoogleCallBack = passport.authenticate("google", {
//   successRedirect: "/",
//   failureRedirect: "/login",
// });

module.exports = {
  signUpController,
  loginController,
  // passportKakao,
  // passportKakaoCallBack,
  // passportGoogle,
  // passportGoogleCallBack,
};
