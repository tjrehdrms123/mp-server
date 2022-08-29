const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

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
