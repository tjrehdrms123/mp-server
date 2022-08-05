const config = require("../config");
const { sign, verify } = require("jsonwebtoken");

function generateAccessToken(data) {
  // accessToken 생성
  return sign({ data }, config.access_secret, { expiresIn: "24h" });
}
function generateRefreshToken(data) {
  // refreshToken 생성
  return sign({ data }, config.refresh_secret, { expiresIn: "24h" });
}
function checkRefreshToken(refreshToken) {
  // refreshToken 인증
  try {
    return verify(refreshToken, config.refresh_secret);
  } catch (error) {
    return null;
  }
}
function resendAccesToken(res, accessToken, data) {
  // refreshToken 인증 완료 후 accessToken 재발급
  return res.send({
    data: {
      accessToken,
      user: data,
    },
    content: "accessToken이 재발급 완료되었습니다",
  });
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  checkRefreshToken,
  resendAccesToken,
};
