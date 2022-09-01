const crypto = require("crypto");
require("dotenv").config();

function hash(value) {
  const hash = crypto
    .createHmac("sha256", process.env.SALT)
    .update(value)
    .digest("hex");
  return hash;
}

async function equalToQuery(instance, key, value) {
  let userQry = [];
  let userequaltoQry = {};
  let userInfo = [];
  for (let i = 0; i < value.length; i++) {
    userQry.push(new Parse.Query(instance));
    userQry[i]?.equalToA(key[i], value[i]);
    userequaltoQry = await userQry[i]?.first();
    userInfo.push(userequaltoQry?.toJSON());
  }
  return userInfo;
}

module.exports = {
  hash,
  equalToQuery,
};
