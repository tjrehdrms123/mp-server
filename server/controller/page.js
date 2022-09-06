const { trsformNumber } = require("../middleware/common");
const { refreshTokenValidation } = require("../middleware/jwt");
const { pageCreateQuery } = require("../model/page");

// 이메일 인증 컨트롤러
async function pageListController(req, res, next) {
  try {
    const id = trsformNumber(req.params.id);
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}
async function pageCreateController(req, res, next) {
  try {
    console.log("ok");
    const id = trsformNumber(req.params.id);
    const { title, description, active } = req.body;
    const token = refreshTokenValidation(req);
    const result = await pageCreateQuery(id, token, title, description, active);
    next(result);
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}
async function pageUpdateController(req, res, next) {}
async function pageDeleteController(req, res, next) {}
module.exports = {
  pageListController,
  pageCreateController,
  pageUpdateController,
  pageDeleteController,
};
