const { Router } = require("express");
const router = Router();
const crypto = require("crypto");
const config = require("../config");
const { signUpQuery } = require("../model/user");
/**
 * @swagger
 *  /user/signup:
 *    post:
 *      tags:
 *      - user
 *      summary: 유저 회원가입
 *      description: 유저 회원가입
 *      consumes:
 *      - application/json
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: body
 *          name: Body
 *          required: true
 *          description :
 *          schema:
 *              $ref: '#/definitions/UserSignUp'
 */

router.post("/signup", async (req, res, next) => {
  const { uid, name, email, password, verify_type } = req.body;

  // 비밀번호 sha256 알고리즘으로 해시값으로 변경
  const passwordHash = crypto
    .createHmac("sha256", config.SALT)
    .update(uid + name)
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
});

module.exports = router;
