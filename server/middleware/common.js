const crypto = require("crypto");
const { errorCode } = require("../res_code/code");
require("dotenv").config();

/**
 * @description SHA256 알고리즘으로 HASH하는 함수
 * @param {*} value
 * @returns {string} HASH화 된 문자열
 */
function hash(value) {
  try {
    const hash = crypto
      .createHmac("sha256", process.env.SALT)
      .update(value)
      .digest("hex");
    return hash;
  } catch (error) {
    errorCode.message = error.message;
    return errorCode;
  }
}

/**
 * @description validation을 위해 사용되는 함수
 * @param {Parse.Object.extend} instance
 * @param {Array} key
 * @param {Array} value
 * @returns {Array} 유저 정보에 대한 배열
 */
async function equalToQuery(instance, key, value) {
  try {
    let userQry = [];
    let userequaltoQry = {};
    let userInfo = [];
    for (let i = 0; i < value.length; i++) {
      userQry.push(new Parse.Query(instance));
      userQry[i]?.equalTo(key[i], value[i]);
      userequaltoQry = await userQry[i]?.first();
      userInfo.push(userequaltoQry?.toJSON());
    }
    return userInfo;
  } catch (error) {
    errorCode.message = error.message;
    return errorCode;
  }
}

/**
 * @description 넘어온 형을 Number형으로 변환해주는 함수
 * @param {*} id
 * @returns
 */
function trsformNumber(id) {
  try {
    return Number(id);
  } catch (error) {
    errorCode.message = error.message;
    return errorCode;
  }
}

module.exports = {
  hash,
  equalToQuery,
  trsformNumber,
};
