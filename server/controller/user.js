const crypto = require("crypto");
const config = require("../config");
const { signUpQuery, loginQuery } = require("../model/user");
const { hash } = require("../middleware/common");

// 회원가입 컨트롤러
async function signUpController(req, res, next) {
  const { uid, name, email, password, auth_type } = req.body;
  // 비밀번호 sha256 알고리즘으로 해시값으로 변경
  const passwordHash = hash(password);
  const emailCodeAuthHash = hash(uid + email);
  const result = await signUpQuery(
    uid,
    name,
    email,
    passwordHash,
    emailCodeAuthHash,
    auth_type
  );
  next(result);
}

async function loginController(req, res, next) {
  const { uid, password, auth_type } = req.body;
  const passwordHash = hash(password);
  const result = await loginQuery(uid, password, passwordHash, auth_type);
  next(result);
}

module.exports = {
  signUpController,
  loginController,
};
