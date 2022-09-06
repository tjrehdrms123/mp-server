const { refreshTokenValidation } = require("../middleware/jwt");
const { errorCode } = require("../res_code/code");
const { loginQuery } = require("./user");

async function resendAccesToken(req, res, next) {
  try {
    const refreshToken = refreshTokenValidation(req);
    const result = await loginQuery(
      refreshToken.uid,
      refreshToken.password,
      "",
      3,
      ""
    );
    return result;
  } catch (error) {
    errorCode.message = error.message;
    return errorCode;
  }
}

module.exports = {
  resendAccesToken,
};
