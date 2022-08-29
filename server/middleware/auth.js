const { sign, verify } = require("jsonwebtoken");
async function tokenVerify(req, res, next) {
  try {
    const token = req.headers.authorization;
    const user = verify(token, config.access_secret);
    return (data = {
      user,
    });
  } catch (error) {
    console.log("auth.js error : ", error);
  }
}

module.exports = {
  tokenVerify,
};
