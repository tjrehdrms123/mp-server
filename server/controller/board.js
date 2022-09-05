const { trsformNumber } = require("../middleware/common");

// 이메일 인증 컨트롤러
async function boardListController(req, res, next) {
  const id = trsformNumber(req.params.id);
}
async function boardCreateController(req, res, next) {}
async function boardUpdateController(req, res, next) {}
async function boardDeleteController(req, res, next) {}
module.exports = {
  boardListController,
  boardCreateController,
  boardUpdateController,
  boardDeleteController,
};
