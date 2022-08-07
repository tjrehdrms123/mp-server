const crypto = require("crypto");
const config = require("../config");
const { signUpQuery, loginQuery } = require("../model/user");

// 회원가입 컨트롤러
async function signUpController(req, res, next) {
  const { uid, name, email, password, verify_type } = req.body;

  // 비밀번호 sha256 알고리즘으로 해시값으로 변경
  const passwordHash = crypto
    .createHmac("sha256", config.SALT)
    .update(password)
    .digest("hex");

  const result = await signUpQuery(uid, name, email, passwordHash);
  if (verify_type === 0) {
    if (result.status === 200) {
      res.status(200).send(result);
    }
    if (result.status === 400) {
      res.status(400).send(result);
    }
    if (result.status === 500) {
      res.status(500).send(result);
    }
  }
}

async function loginController(req, res, next) {
  const { uid, password } = req.body;

  const passwordHash = crypto
    .createHmac("sha256", config.SALT)
    .update(password)
    .digest("hex");

  const result = await loginQuery(uid, password, passwordHash);
  if (result.status === 200) {
    res.status(200).send(result);
  }
  if (result.status === 400) {
    res.status(400).send(result);
  }
  if (result.status === 500) {
    res.status(500).send(result);
  }
}

module.exports = {
  signUpController,
  loginController,
};
