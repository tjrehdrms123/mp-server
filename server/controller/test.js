const { testQuery } = require("../model/test");
const { errorCode } = require("../res_code/code");

// 이메일 인증 컨트롤러
async function testController(req, res, next) {
  try {
    console.log(req.body);
    // const result = await testQuery(
    //   req
    // );
    // next(result);
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}
module.exports = {
  testController,
};
