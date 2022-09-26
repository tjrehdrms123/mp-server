const Parse = require("parse/node");
require("dotenv").config();
const {
  successCode,
  // 그외
  errorCode,
  requestErrorCode,
  successPageCode,
} = require("../res_code/code");

Parse.initialize( 
  process.env.PARSEAPPID,
  process.env.PARSEJAVASCRIPTKEY,
  process.env.PARSEMASTERKEY
);
Parse.serverURL = process.env.PARSESERVERURL;
Parse.User.enableUnsafeCurrentUser();

const Test = Parse.Object.extend("page");

async function testQuery(req) {
  try {
      //for (let i = 0; i < req.body.represent_images.length; i++) {
        //}
    const file = new Parse.File("image.png", {base64: req.body.profile});
    const test = new Test();
    test.set("proflie", file);
    test.set("title", 'title');
    test.set("description", 'description');
    test.set("delete_status", false);
    await test.save();
    successPageCode.data = "페이지 등록이 완료되었습니다";
    return successPageCode;
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}

async function testTokenQuery(token, req) {
  try{
    if (!token){
      requestErrorCode.data.message = "잘못된 요청 입니다";
      console.log(token);
      return requestErrorCode;
    }
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}

module.exports = {
  testQuery, // 이메일 인증 쿼리
  testTokenQuery,
};
