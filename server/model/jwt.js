const { refreshTokenValidation } = require("../middleware/jwt");
const { loginQuery } = require("./user");

async function resendAccesToken(req, res, next) {
  const refreshToken = refreshTokenValidation(req);
  const result = await loginQuery(
    refreshToken.uid,
    refreshToken.password,
    "",
    3,
    ""
  );
  return result;
}

module.exports = {
  resendAccesToken,
};
