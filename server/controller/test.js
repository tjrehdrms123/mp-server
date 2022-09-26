const { refreshTokenValidation } = require("../middleware/jwt");
const { testQuery } = require("../model/test");
const { errorCode } = require("../res_code/code");

// 이메일 인증 컨트롤러
async function testController(req, res, next) {
  try {
    const result = await testQuery(
      req
    );
    next(result);
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}

async function testTokenController(req, res, next){
  try{
    const token = refreshTokenValidation(req);
    console.log(req.cookies.refreshToken);
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}

module.exports = {
  testController,
  testTokenController,
};
