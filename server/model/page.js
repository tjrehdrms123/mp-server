const Parse = require("parse/node");
require("dotenv").config();
const {
  successCode,
  requestErrorCode,
  errorCode,
  successPageCode,
} = require("../res_code/code");
const { equalToQuery } = require("../middleware/common");
const { isTokenQuery } = require("./user");

Parse.initialize(
  process.env.PARSEAPPID,
  process.env.PARSEJAVASCRIPTKEY,
  process.env.PARSEMASTERKEY
);
Parse.serverURL = process.env.PARSESERVERURL;

const Page = Parse.Object.extend("page");

// 페이지 조회
async function pageListQuery(token, id) {
  try {
    await isTokenQuery(token);
    const pageInfo = await equalToQuery(Page, ["objectId"], [id]);
    if (!pageInfo[0]) {
      requestErrorCode.data.message = "존재하지 않는 페이지 입니다";
      return requestErrorCode;
    }
    successPageCode.data = pageInfo[0];
    return successPageCode;
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}
// 페이지 전체 조회
async function pageListAllQuery(token, id) {
  try {
    await isTokenQuery(token);
    const query = new Parse.Query(Page);
    const value = await query.find();
    const pageInfo = [];
    value.map((k, i) => {
      pageInfo.push(value[i].toJSON());
    });
    successPageCode.data = pageInfo;
    return successPageCode;
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}
// 페이지 생성
async function pageCreateQuery(token, title, description, is_active) {
  try {
    const uid = await isTokenQuery(token);
    if (!title || !description) {
      requestErrorCode.data.message = "데이터가 없습니다";
      return requestErrorCode;
    }
    const page = new Page();
    page.set("title", title);
    page.set("description", description);
    page.set("is_active", is_active);
    page.set("auth_id", {
      __type: "Pointer",
      className: "user",
      objectId: uid,
    });
    await page.save();
    successCode.data.message = "페이지 등록이 완료되었습니다";
    return successCode;
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}

module.exports = {
  pageListQuery,
  pageListAllQuery,
  pageCreateQuery, // 페이지 생성 쿼리
};
