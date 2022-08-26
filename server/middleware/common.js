const crypto = require("crypto");
require("dotenv").config();

function hash(value) {
  const hash = crypto
    .createHmac("sha256", process.env.SALT)
    .update(value)
    .digest("hex");
  return hash;
}

module.exports = {
  hash,
};
