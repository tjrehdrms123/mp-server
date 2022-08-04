const Parse = require("parse/node");
const config = require("../config");

Parse.initialize(
  config.parseAppId,
  config.parseJavascriptKey,
  config.parseMasterKey
);
Parse.serverURL = config.parseServerURL;
Parse.User.enableUnsafeCurrentUser();

const User = Parse.Object.extend("user");
const user = new User();
// id, email 중복 체크
const idQry = new Parse.Query(User);
const emailQry = new Parse.Query(User);
idQry.equalTo("uid", uid);
emailQry.equalTo("email", email);

async function signUpQuery(uid, name, email, passwordHash, verify_type) {
  const idCheck = await idQry.first();
  const emailCheck = await emailQry.first();
  if (idCheck) {
    return {
      status: 400,
      data: {
        data: {
          uid: uid,
        },
        content: "입력하신 아이디가 중복 되었습니다",
      },
    };
  }
  if (emailCheck) {
    return {
      status: 400,
      data: {
        data: {
          email: email,
        },
        content: "입력하신 이메일이 중복 되었습니다",
      },
    };
  }
  try {
    user.set("uid", uid);
    user.set("name", name);
    user.set("email", email);
    user.set("password", passwordHash);
    user.set("verify_type", verify_type);
    await user.save();
    return {
      status: 200,
      data: {
        objectId: user.id,
        uid: uid,
        name: name,
        email: email,
        content: "회원가입이 완료되었습니다",
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: {
        content: error.message,
      },
    };
  }
}

module.exports = {
  signUpQuery,
};
