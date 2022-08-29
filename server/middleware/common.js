const crypto = require("crypto");
const { emailUidQuery, signUpPassportQuery } = require("../model/user");
require("dotenv").config();

function hash(value) {
  const hash = crypto
    .createHmac("sha256", process.env.SALT)
    .update(value)
    .digest("hex");
  return hash;
}

async function emailUidQuery(email) {
  const userInfo = emailUidQuery(email);
  return userInfo;
}

module.exports = {
  hash,
  emailUidQuery,
};
