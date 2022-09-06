const Parse = require("parse/node");
require("dotenv").config();
const {
  successCode,
  requestErrorCode,
  errorCode,
} = require("../res_code/code");
const { equalToQuery } = require("../middleware/common");

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
    const userInfo = await equalToQuery(User, ["uid"], [token.uid]);
    if (!token) {
      requestErrorCode.data.message = "토큰이 없습니다";
      return requestErrorCode;
    }
    if (
      token.uid != userInfo[0].uid ||
      token.password != userInfo[0].password
    ) {
      requestErrorCode.data.message = "옳바르지 않은 토큰 입니다";
      return requestErrorCode;
    }
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
      objectId: userInfo[0].objectId,
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
  pageCreateQuery, // 페이지 생성 쿼리
};
