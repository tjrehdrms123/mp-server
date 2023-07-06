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

/**
 * GET : 한개 추억 가져오기
 * @param {object} req - { params.id }
 * @param {object} res 
 * @param {function} next 
 * @returns {Promise}
 */
async function pageListController(req, res, next) {
  try {
    const id = req.params.id;
    // 유요한 토근인지 검증
    const token = tokenValidation(req);
    // id를 통해 등록된 전체 게시물을 가져옴
    const result = await pageListQuery(token, id);
    next(result);
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}

/**
 * GET : 전체 추억 가져오기
 * @param {object} req
 * @param {object} res 
 * @param {function} next 
 * @returns {Promise}
 */
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

/**
 * POST : 추억 등록하기
 * @param {object} req - { body title, description, writer, lat, lng, auth_id, markerimg }
 * @param {object} res 
 * @param {function} next 
 * @returns {Promise}
 */
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

/**
 * PATCH : 추억 업데이트
 * @param {object} req - { params id }, { body title, description, delete_status }
 * @param {object} res 
 * @param {function} next 
 * @returns {Promise}
 */
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

/**
 * DELETE : 추억 삭제
 * @param {object} req - { params id }
 * @param {object} res 
 * @param {function} next 
 * @returns {Promise}
 */
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
