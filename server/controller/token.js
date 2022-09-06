const {
  tokenValidation,
  refreshTokenValidation,
} = require("../middleware/jwt");
const { resendAccesToken } = require("../model/jwt");

// JWT 토근 유효성 검사
function tokenValidationController(req, res, next) {
  try {
    const token = tokenValidation(req);
    next(token);
  } catch (error) {
    errorCode.message = error.message;
    return errorCode;
  }
}
function refreshTokenValidationController(req, res, next) {
  try {
    const token = refreshTokenValidation(req);
    next(token);
  } catch (error) {
    errorCode.message = error.message;
    return errorCode;
  }
}
async function resendAccesTokenController(req, res, next) {
  try {
    const result = await resendAccesToken(req);
    next(result);
  } catch (error) {
    errorCode.message = error.message;
    return errorCode;
  }
}

module.exports = {
  tokenValidationController,
  refreshTokenValidationController,
  resendAccesTokenController,
};
