const { trsformNumber } = require("../middleware/common");
const { refreshTokenValidation } = require("../middleware/jwt");
const {
  pageCreateQuery,
  pageListQuery,
  pageListAllQuery,
  pageUpdateQuery,
} = require("../model/page");
const { errorCode } = require("../res_code/code");

async function pageListController(req, res, next) {
  try {
    const id = req.params.id;
    const token = refreshTokenValidation(req);
    const result = await pageListQuery(token, id);
    next(result);
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}
async function pageListAllController(req, res, next) {
  try {
    const token = refreshTokenValidation(req);
    const result = await pageListAllQuery(token);
    next(result);
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}
async function pageCreateController(req, res, next) {
  try {
    const { title, description, is_active } = req.body;
    const token = refreshTokenValidation(req);
    const result = await pageCreateQuery(token, title, description, is_active);
    next(result);
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}
async function pageUpdateController(req, res, next) {
  try {
    const id = req.params.id;
    const { title, description, is_active } = req.body;
    const token = refreshTokenValidation(req);
    const result = await pageUpdateQuery(
      token,
      id,
      title,
      description,
      is_active
    );
    next(result);
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}
async function pageDeleteController(req, res, next) {}
module.exports = {
  pageListController,
  pageListAllController,
  pageCreateController,
  pageUpdateController,
  pageDeleteController,
};
