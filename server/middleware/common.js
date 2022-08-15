const crypto = require("crypto");
const config = require("../config");

function hash(value) {
  const hash = crypto
    .createHmac("sha256", config.SALT)
    .update(value)
    .digest("hex");
  return hash;
}

module.exports = {
  hash,
};
