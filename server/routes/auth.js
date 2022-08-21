const { Router } = require("express");
const router = Router();
const { emailAuthController, passportKakao } = require("../controller/auth");
const passport = require("passport");
/**
 * @swagger
 *  /auth/email:
 *    post:
 *      tags:
 *      - email
 *      summary: 유저 메일 인증
 *      description: 유저 메일 인증
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
 *              $ref: '#/definitions/AuthEmail'
 */

router.post("/email", emailAuthController);
router.get(
  "/kakao",
  passport.authenticate("kakao", {
    accessType: "offline",
    prompt: "consent",
  })
);
router.get(
  "/kakao/secrets",
  passport.authenticate("kakao", {
    failureRedirect: "/login", // kakaoStrategy에서 실패한다면 실행
  }),
  // kakaoStrategy에서 성공한다면 콜백 실행
  (req, res) => {
    res.redirect("/");
  }
);

module.exports = router;
