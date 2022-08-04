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

async function signUpQuery(uid, name, email, passwordHash, verify_type) {
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
