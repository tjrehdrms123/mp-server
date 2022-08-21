const { emailAuthQuery } = require("../model/auth");
const { emailUidQuery, signUpPassportQuery } = require("../model/user");
const { hash } = require("../middleware/common");
const passport = require("passport");
const { passports } = require("../config");
const KakaoStrategy = require("passport-kakao").Strategy;

// 이메일 인증 컨트롤러
async function emailAuthController(req, res, next) {
  const { email } = req.body;
  const uid = await emailUidQuery(email);
  const emailCodeAuthHash = hash(uid + email);
  const result = await emailAuthQuery(uid, emailCodeAuthHash, email);
  next(result);
}

// kakao
// passport kakao
passport.use(
  new KakaoStrategy(
    {
      clientID: passports.kakao.rest_api_key,
      callbackURL: passports.kakao.callbackURL,
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log("profile kakao : ", profile);
      //signUpPassportQuery(profile.id,profile.username,profile._json.kakao_account.email,1)
      return cb(null, {
        user_id: profile.name,
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

const passportKakao = passport.authenticate("kakao", {
  accessType: "offline",
  prompt: "consent",
});

const passportKakaoCallBack = passport.authenticate("kakao", {
  successRedirect: "/",
  failureRedirect: "/login", // kakaoStrategy에서 실패한다면 실행
});

module.exports = {
  emailAuthController,
  passportKakao,
  passportKakaoCallBack,
};
