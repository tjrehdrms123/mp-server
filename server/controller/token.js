const {
  tokenValidation,
  refreshTokenValidation,
} = require("../middleware/jwt");
const { resendAccesToken } = require("../model/jwt");

// JWT 토근 유효성 검사
function tokenValidationController(req, res, next) {
  const token = tokenValidation(req);
  next(token);
}
function refreshTokenValidationController(req, res, next) {
  const token = refreshTokenValidation(req);
  next(token);
}
async function resendAccesTokenController(req, res, next) {
  const result = await resendAccesToken(req);
  next(result);
}

module.exports = {
  tokenValidationController,
  refreshTokenValidationController,
  resendAccesTokenController,
};
