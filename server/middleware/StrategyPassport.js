const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

/**
 * @description [NOT USE] Passport 카카오톡 로그인 인증 전략
 * @param {*} user
 */
function kakaoStrategy(user) {
  passport.use(
    new KakaoStrategy(
      {
        clientID: passports.kakao.rest_api_key,
        callbackURL: passports.kakao.callbackURL,
      },
      function (accessToken, refreshToken, profile, cb) {
        return cb(null, {
          user_id: profile.name,
          provider: profile.provider,
        });
      }
    )
  );
}
/**
 * @description [NOT USE] Passport 구글 로그인 인증 전략
 * @param {*} user
 */
function googleStrategy(user) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: passports.google.client_id,
        clientSecret: passports.google.client_secret,
        callbackURL: passports.google.callbackURL,
      },
      function (accessToken, refreshToken, profile, cb) {
        return cb(null, {
          user_id: profile.name,
          provider: profile.provider,
        });
      }
    )
  );
}

module.exports = {
  kakaoStrategy,
  googleStrategy,
};
