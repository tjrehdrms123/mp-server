const { trsformNumber } = require("../middleware/common");
const { tokenValidation } = require("../middleware/jwt");
const {
  pageCreateQuery,
  pageListQuery,
  pageListAllQuery,
  pageUpdateQuery,
  pageDeleteQuery,
} = require("../model/page");
const { errorCode } = require("../res_code/code");

async function pageListController(req, res, next) {
  try {
    const id = req.params.id;
    const token = tokenValidation(req);
    const result = await pageListQuery(token, id);
    next(result);
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}

async function pageListAllController(req, res, next) {
  try {
    const token = tokenValidation(req);
    const result = await pageListAllQuery(token);
    next(result);
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}
async function pageCreateController(req, res, next) {
  try {
    const { title, description, writer, lat, lng, auth_id, markerimg } =
      req.body;
    //const token = tokenValidation(req);
    const result = await pageCreateQuery(
      title,
      description,
      writer,
      lat,
      lng,
      auth_id,
      markerimg
    );
    next(result);
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}
async function pageUpdateController(req, res, next) {
  try {
    const id = req.params.id;
    const { title, description, delete_status } = req.body;
    const token = tokenValidation(req);
    const result = await pageUpdateQuery(
      token,
      id,
      title,
      description,
      delete_status
    );
    next(result);
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}
async function pageDeleteController(req, res, next) {
  try {
    const id = req.params.id;
    const token = tokenValidation(req);
    const result = await pageDeleteQuery(token, id);
    next(result);
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}
module.exports = {
  pageListController,
  pageListAllController,
  pageCreateController,
  pageUpdateController,
  pageDeleteController,
};
