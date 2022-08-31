require("dotenv").config();
const { sign, verify } = require("jsonwebtoken");
const { errorCode, loginToken, loginSuccess } = require("../res_code/code");

function generateAccessToken(data) {
  // accessToken 생성
  return sign(data, process.env.ACCESS_SECRET, { expiresIn: "24h" });
}
function generateRefreshToken(data) {
  // refreshToken 생성
  return sign(data, process.env.REFRESH_SECRET, { expiresIn: "24h" });
}
function checkRefreshToken(refreshToken) {
  // refreshToken 인증
  try {
    return verify(refreshToken, process.env.REFRESH_SECRET);
  } catch (error) {
    return null;
  }
}
function tokenValidation(req, res, next) {
  const authorization = req?.headers?.authorization;
  if (!authorization) {
    return accessInvalidToken;
  }
  const payload = authorization.split(" ")[1];
  try {
    const data = verify(payload, process.env.ACCESS_SECRET);
    return data;
  } catch (err) {
    next(errorCode);
  }
}
function refreshTokenValidation(req, res, next) {
  const refreshToken = req.cookies.refreshToken.data.refreshToken;
  if (!refreshToken) {
    return refreshInvalidToken;
  }
  try {
    const data = verify(refreshToken, process.env.REFRESH_SECRET);
    return data;
  } catch (err) {
    next(errorCode);
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  checkRefreshToken,
  tokenValidation,
  refreshTokenValidation,
};
