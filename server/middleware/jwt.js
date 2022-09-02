require("dotenv").config();
const { sign, verify } = require("jsonwebtoken");
const { errorCode, loginToken, loginSuccess } = require("../res_code/code");

/**
 * @description accessToken을 생성하는 함수
 * @param {string} data
 * @returns accessToken
 */
function generateAccessToken(data) {
  return sign(data, process.env.ACCESS_SECRET, { expiresIn: "24h" });
}
/**
 * @description refreshToken을 생성하는 함수
 * @param {string} data
 * @returns refreshToken
 */
function generateRefreshToken(data) {
  return sign(data, process.env.REFRESH_SECRET, { expiresIn: "24h" });
}
/**
 * @description Bearer Token:accessToken을 검증하는 함수
 * @param {string} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
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
/**
 * @description 쿠기에 저장되어있는 토큰을 가져와서 refresh 토큰 검증하는 함수
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
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
  tokenValidation,
  refreshTokenValidation,
};
