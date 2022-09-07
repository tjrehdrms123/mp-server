const Parse = require("parse/node");
require("dotenv").config();
const {
  successCode,
  requestErrorCode,
  errorCode,
} = require("../res_code/code");
const { equalToQuery } = require("../middleware/common");
const { isTokenQuery } = require("./user");

Parse.initialize(
  process.env.PARSEAPPID,
  process.env.PARSEJAVASCRIPTKEY,
  process.env.PARSEMASTERKEY
);
Parse.serverURL = process.env.PARSESERVERURL;
Parse.User.enableUnsafeCurrentUser();

const Page = Parse.Object.extend("page");
const User = Parse.Object.extend("user");

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
    console.log(error);
    errorCode.data.message = error.message;
    return errorCode;
  }
}

module.exports = {
  pageCreateQuery, // 페이지 생성 쿼리
};
