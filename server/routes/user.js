const { Router } = require("express");
const router = Router();
const {
  signUpController,
  loginController,
  passportKakao,
  passportKakaoCallBack,
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
router.get(
  "/kakao",
  passport.authenticate("kakao", {
    accessType: "offline",
    prompt: "consent",
  })
);
router.get(
  "/kakao/secrets",
  //? 그리고 passport 로그인 전략에 의해 kakaoStrategy로 가서 카카오계정 정보와 DB를 비교해서 회원가입시키거나 로그인 처리하게 한다.
  passport.authenticate("kakao", {
    failureRedirect: "/login", // kakaoStrategy에서 실패한다면 실행
  }),
  // kakaoStrategy에서 성공한다면 콜백 실행
  (req, res) => {
    res.redirect("/");
  }
);
router.post("/login", loginController);

module.exports = router;
