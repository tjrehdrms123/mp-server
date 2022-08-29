const { findEmailUidQuery } = require("../middleware/common");
// const {
//   pageFindQuery,
//   pageAddQuery,
//   pageUpdateQuery,
//   pageDeleteQuery,
// } = require("../model/page");

// 페이지 찾기
async function pageFindController(req, res, next) {
  const { accessToken } = req.body;
}
// 페이지 등록
async function pageAddController(req, res, next) {}
// 페이지 업데이트
async function pageUpdateController(req, res, next) {}
// 페이지 삭제
async function pageDeleteController(req, res, next) {}

module.exports = {
  pageFindController,
  pageAddController,
  pageUpdateController,
  pageDeleteController,
};
