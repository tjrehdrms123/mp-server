const { Router } = require("express");
const router = Router();
const {
  signUpController,
  loginController,
  passportKakao,
  passportKakaoCallBack,
  passportGoogle,
  passportGoogleCallBack,
} = require("../controller/user");
const passport = require("passport");

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

/**
 * @swagger
 *  /user/login:
 *    post:
 *      tags:
 *      - user
 *      summary: 유저 로그인
 *      description: 유저 로그인
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
 *              $ref: '#/definitions/UserLogin'
 */

router.post("/signup", signUpController);
// router.get("/kakao", passportKakao);
// router.get("/kakao/secrets", passportKakaoCallBack, (req, res) => {
//   res.redirect("/");
// });
// router.get("/google", passportGoogle);
// router.get("/google/secrets", passportGoogleCallBack, (req, res) => {
//   res.redirect("/");
// });
router.post("/login", loginController);

module.exports = router;
