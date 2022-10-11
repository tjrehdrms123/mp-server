require("dotenv").config();
const { sign, verify } = require("jsonwebtoken");
const { errorCode, requestErrorCode, successCode } = require("../res_code/code");

/**
 * @description accessToken을 생성하는 함수
 * @param {string} data
 * @returns accessToken
 */
function generateAccessToken(data) {
  try {
    return sign(data, process.env.ACCESS_SECRET, { expiresIn: "30s" });
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
    if (!req?.headers?.authorization) {
      requestErrorCode.data.message = "authorization가 없습니다";
      return requestErrorCode;
    }
    const authorization = req?.headers?.authorization;
    if (!authorization) {
      return accessInvalidToken;
    }
    const payload = authorization.split(" ")[1];
    const data = verify(payload, process.env.ACCESS_SECRET,function(err,decoded){
      if(err?.name === "TokenExpiredError"){
        requestErrorCode.data.message = "토큰이 만료 되었습니다";
        return requestErrorCode;
      }
      if(err?.name === "JsonWebTokenError"){
        requestErrorCode.data.message = "유효하지 않은 토큰입니다";
        return requestErrorCode;
      }
      successCode.data.message = "토큰 인증이 완료되었습니다";
      return successCode;
    });
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
    if (!req?.cookies?.refreshToken?.data?.refreshToken) {
      requestErrorCode.data.message = "refreshToken가 없습니다";
      return requestErrorCode;
    }
    const refreshToken = req.cookies.refreshToken.data.refreshToken;
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
