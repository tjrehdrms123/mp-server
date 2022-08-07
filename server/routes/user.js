const { Router } = require("express");
const router = Router();
const { signUpController, loginController } = require("../controller/user");

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

router.post("/signup", signUpController);
router.post("/login", loginController);

module.exports = router;
