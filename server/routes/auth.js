const { Router } = require("express");
const router = Router();
const { emailAuthController } = require("../controller/auth");

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

router.post("/emcail", emailAuthController);

module.exports = router;
