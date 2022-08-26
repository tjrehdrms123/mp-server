require("dotenv").config();
const { sign, verify } = require("jsonwebtoken");

function generateAccessToken(data) {
  // accessToken 생성
  return sign({ data }, process.env.ACCESS_SECRET, { expiresIn: "24h" });
}
function generateRefreshToken(data) {
  // refreshToken 생성
  return sign({ data }, process.env.REFRESH_SECRET, { expiresIn: "24h" });
}
function checkRefreshToken(refreshToken) {
  // refreshToken 인증
  try {
    return verify(refreshToken, process.env.REFRESH_SECRET);
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
