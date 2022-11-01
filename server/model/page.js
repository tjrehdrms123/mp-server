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
    // if (token.status === 400){
    //   requestErrorCode.data.message = token.data.message;
    //   return requestErrorCode;
    // }
    // const uid = await isTokenQuery(token);
    // if (!uid) {
    //   requestErrorCode.data.message = "토큰 에러 입니다";
    //   return requestErrorCode;
    // }
    const query = new Parse.Query(Page);
    query.equalTo("auth_id", id);
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
// 페이지 전체 조회
async function pageListAllQuery(token, id) {
  try {
    // if (token.status === 400){
    //   requestErrorCode.data.message = token.data.message;
    //   return requestErrorCode;
    // }
    // const uid = await isTokenQuery(token);
    // if (!uid) {
    //   requestErrorCode.data.message = "토큰 에러 입니다";
    //   return requestErrorCode;
    // }
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
async function pageCreateQuery(
  token,
  title,
  description,
  writer,
  lat,
  lng,
  auth_id,
  markerimg
) {
  try {
    // if (token.status === 400 || token.status === 500) {
    //   requestErrorCode.data.message = token.data.message;
    //   return requestErrorCode;
    // }
    // const uid = await isTokenQuery(token);
    if (!title || !description) {
      requestErrorCode.data.message = "데이터가 없습니다";
      return requestErrorCode;
    }
    if (!markerimg) {
      requestErrorCode.data.message = "프로필 이미지가 없습니다";
      return requestErrorCode;
    }
    const markerimgImg = new Parse.File("image.png", { base64: markerimg });
    const page = new Page();
    page.set("title", title);
    page.set("description", description);
    page.set("writer", writer);
    page.set("lat", lat);
    page.set("lng", lng);
    page.set("markerimg", markerimgImg);
    page.set("delete_status", false);
    auth_id != undefined ? page.set("auth_id", {
      __type: "Pointer",
      className: "user",
      objectId: auth_id,
    }) : '';
    await page.save();
    successCode.data.message = "추억 등록이 완료되었습니다";
    return successCode;
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}
/**
 * @description 페이지 업데이트 API
 * @param {jsontoken} token
 * @param {objectId} id
 * @param {request_title} r_title
 * @param {request_description} r_description
 * @param {is_active} is_active
 * @returns
 */
async function pageUpdateQuery(
  token,
  id,
  r_title,
  r_description,
  delete_status
) {
  try {
    if (token.status === 400) {
      requestErrorCode.data.message = token.data.message;
      return requestErrorCode;
    }
    if (!id) {
      requestErrorCode.data.message = "id값이 없습니다";
      return requestErrorCode;
    }
    await isTokenQuery(token);
    const pageInfo = await equalToQuery(Page, ["objectId"], [id], true);
    const { title, description, objectId } = pageInfo[1][0];
    const pageInstance = pageInfo[0][0];
    if (!title || !description) {
      requestErrorCode.data.message = "데이터가 없습니다";
      return requestErrorCode;
    }
    if (!objectId) {
      requestErrorCode.data.message = "존재하지 않는 추억 입니다";
      return requestErrorCode;
    }
    pageInstance.set("objectId", objectId);
    pageInstance.set("title", r_title);
    pageInstance.set("description", r_description);
    pageInstance.set("delete_status", delete_status);
    await pageInstance.save();
    successCode.data.message = "페이지 수정이 완료되었습니다";
    return successCode;
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}
// 페이지 삭제
async function pageDeleteQuery(token, id) {
  try {
    if (token.status === 400) {
      requestErrorCode.data.message = token.data.message;
      return requestErrorCode;
    }
    if (!id) {
      requestErrorCode.data.message = "id값이 없습니다";
      return requestErrorCode;
    }
    await isTokenQuery(token);
    const pageInfo = await equalToQuery(Page, ["objectId"], [id], true);
    const pageInstance = pageInfo[0][0];
    if (!id) {
      requestErrorCode.data.message = "삭제할 추억 데이터가 없습니다";
      return requestErrorCode;
    }
    pageInstance.set("delete_status", true);
    await pageInstance.save();
    successCode.data.message = "추억 삭제가 완료되었습니다";
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
  pageUpdateQuery,
  pageDeleteQuery,
};
