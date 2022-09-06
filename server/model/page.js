const Parse = require("parse/node");
require("dotenv").config();
const {} = require("../res_code/code");
const { equalToQuery } = require("../middleware/common");

Parse.initialize(
  process.env.PARSEAPPID,
  process.env.PARSEJAVASCRIPTKEY,
  process.env.PARSEMASTERKEY
);
Parse.serverURL = process.env.PARSESERVERURL;
Parse.User.enableUnsafeCurrentUser();

const Page = Parse.Object.extend("page");

// 페이지 생성
async function pageCreateQuery(id, token, title, description, active) {
  console.log(id, token, title, description, active);
}

module.exports = {
  pageCreateQuery, // 페이지 생성 쿼리
};
