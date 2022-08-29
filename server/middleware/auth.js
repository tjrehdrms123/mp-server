const { sign, verify } = require("jsonwebtoken");
async function tokenVerify(req, res, next) {
  // 토큰 인증 미들웨어
  try {
    let data = {};

    if (req?.headers?.authorization) {
      // 관리자 토큰 인증
      const token = req.headers.authorization;
      const auth = token.split(" ")[1];
      const admin = verify(auth, config.access_secret); // 토큰으로 관리자 정보 가져오기
      return (data = {
        admin,
      });
    } else if (req?.headers?.sessiontoken) {
      // 앱 유저 토큰 인증
      let user = {};
      user = await Parse.User.become(String(req.headers.sessiontoken)); // 세션 토큰으로 유저 가져오기
    } else {
      return invalidToken; // 토큰 이름이 틀렸을 때 에러
    }
  } catch (error) {
    console.log("auth error", error);
    return invalidToken;
  }
}

module.exports = {
  tokenVerify,
};
