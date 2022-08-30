const {
  tokenValidation,
  refreshTokenValidation,
  resendAccesToken,
} = require("../middleware/jwt");

// JWT 토근 유효성 검사
function tokenValidationController(req, res, next) {
  const token = tokenValidation(req);
  next(token);
}
function refreshTokenValidationController(req, res, next) {
  const token = refreshTokenValidation(req);
  next(token);
}
function resendAccesTokenController(req, res, next) {
  console.log("ABC");
  const result = resendAccesToken(req);
  next(result);
}

module.exports = {
  tokenValidationController,
  refreshTokenValidationController,
  resendAccesTokenController,
};
