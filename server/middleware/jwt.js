require("dotenv").config();
const { sign, verify } = require("jsonwebtoken");
const { errorCode, requestErrorCode } = require("../res_code/code");

/**
 * @description accessToken을 생성하는 함수
 * @param {string} data
 * @returns accessToken
 */
function generateAccessToken(data) {
  try {
    return sign(data, process.env.ACCESS_SECRET, { expiresIn: "24h" });
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}
/**
 * @description refreshToken을 생성하는 함수
 * @param {string} data
 * @returns refreshToken
 */
function generateRefreshToken(data) {
  try {
    return sign(data, process.env.REFRESH_SECRET, { expiresIn: "24h" });
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}
/**
 * @description Bearer Token:accessToken을 검증하는 함수
 * @param {string} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
function tokenValidation(req, res, next) {
  try {
    console.log(req.cookies);
    if (!req?.cookies?.accessToken) {
      requestErrorCode.data.message = "accessToken가 없습니다";
      return requestErrorCode;
    }
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return accessInvalidToken;
    }
    const payload = accessToken.split(" ")[1];
    const data = verify(payload, process.env.ACCESS_SECRET);
    return data;
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
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
  try {
    if (!req?.cookies?.refreshToken) {
      requestErrorCode.data.message = "refreshToken가 없습니다";
      return requestErrorCode;
    }
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return refreshInvalidToken;
    }
    const data = verify(refreshToken, process.env.REFRESH_SECRET);
    return data;
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  tokenValidation,
  refreshTokenValidation,
};
