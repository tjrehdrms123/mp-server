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
    errorCode.data.message = error.message;
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
async function equalToQuery(instance, key, value, type = false) {
  try {
    let userQry = [];
    let userequaltoQry = {};
    let userInfo = [];
    let userInfoJson = [];
    for (let i = 0; i < value.length; i++) {
      userQry.push(new Parse.Query(instance));
      userQry[i]?.equalTo(key[i], value[i]);
      userequaltoQry = await userQry[i]?.first();
      userInfoJson.push(userequaltoQry);
      userInfo.push(userequaltoQry?.toJSON());
    }
    if (type) {
      return [userInfoJson, userInfo];
    } else {
      return userInfo;
    }
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}

/**
 * @description 넘어온 형을 Number형으로 변환해주는 함수
 * @param {string} id
 * @returns {number} id
 */
function trsformNumber(id) {
  try {
    return Number(id);
  } catch (error) {
    errorCode.data.message = error.message;
    return errorCode;
  }
}

/**
 * @description 이메일 형식으로 인증을 보냈는지 확인할때 사용하려고 만든함수
 * @param {string} email 
 * @returns 
 */
function emailCheck(email) {
  var regex=/([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  return (email != '' && email != 'undefined' && regex.test(email));

}

module.exports = {
  hash,
  equalToQuery,
  trsformNumber,
  emailCheck
};
