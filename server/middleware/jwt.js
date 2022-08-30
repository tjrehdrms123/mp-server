require("dotenv").config();
const { sign, verify } = require("jsonwebtoken");
const { errorCode, loginToken, loginSuccess } = require("../res_code/code");

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

function resendAccesToken(req, res, next) {
  const { uid } = req.body;
  try {
    if (uid && refreshTokenValidation(req)) {
      let accessToken = generateAccessToken(uid);
      let refreshToken = generateRefreshToken(uid);
      loginSuccess.data.accessToken = accessToken;
      loginSuccess.data.refreshToken = refreshToken;
      loginToken.data.refreshToken = refreshToken;
      loginToken.data.sameSite = "none";
      loginToken.data.secure = true;
      loginToken.data.httpOnly = true;
      //loginSuccess.data.message = "accessToken이 재발급 완료되었습니다";
      return [loginSuccess, loginToken];
    } else {
      next(errorCode);
    }
  } catch (err) {
    next(errorCode);
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  checkRefreshToken,
  resendAccesToken,
  tokenValidation,
  refreshTokenValidation,
};
