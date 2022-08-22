const crypto = require("crypto");
const config = require("../config");
const {
  signUpQuery,
  loginQuery,
  signUpPassportQuery,
} = require("../model/user");
const { hash } = require("../middleware/common");
const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const { passports } = require("../config");

// passport kakao
passport.use(
  new KakaoStrategy(
    {
      clientID: passports.kakao.rest_api_key,
      callbackURL: passports.kakao.callbackURL,
    },
    async function (accessToken, refreshToken, profile, cb) {
      let result;
      try {
        result = await signUpPassportQuery(
          String(profile.id),
          profile.username,
          profile._json.kakao_account.email,
          1
        );
      } catch (err) {
        console.log("err :", err);
      }
      return cb(null, {
        ...result,
        provider: profile.provider,
      });
    }
  )
);

// serializeUser, deserializeUser
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// 회원가입 컨트롤러
async function signUpController(req, res, next) {
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
    auth_type
  );
  next(result);
}

async function loginController(req, res, next) {
  const { uid, password, auth_type } = req.body;
  const passwordHash = hash(password);
  const result = await loginQuery(uid, password, passwordHash, auth_type);
  next(result);
}

const passportKakao = passport.authenticate("kakao", {
  accessType: "offline",
  prompt: "consent",
});

const passportKakaoCallBack = passport.authenticate("kakao", {
  successRedirect: "/",
  failureRedirect: "/login",
});

module.exports = {
  signUpController,
  loginController,
  passportKakao,
  passportKakaoCallBack,
};
