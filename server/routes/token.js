const { Router } = require("express");
const router = Router();
const {
  tokenValidationController,
  refreshTokenValidationController,
  resendAccesTokenController,
} = require("../controller/token");

/**
 * @swagger
 *  /token/validation:
 *    post:
 *      tags:
 *      - token
 *      summary: 토큰 검증
 *      description: Bearer Token:accessToken을 검증
 *      consumes:
 *      - application/json
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: header
 *          name: authorization
 *          required: true
 *          description : Bearer AccessToken
 */
router.post("/validation", tokenValidationController);

/**
 * @swagger
 *  /token/validation/refresh:
 *    post:
 *      tags:
 *      - token
 *      summary: refresh 토큰 검증
 *      description: refresh 토큰 검증
 *      consumes:
 *      - application/json
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: header
 *          name: authorization
 *          required: true
 *          description : user sessionToken
 */
router.post("/validation/refresh", refreshTokenValidationController);

/**
 * @swagger
 *  /token/reissuance:
 *    post:
 *      tags:
 *      - token
 *      summary: refresh,access 토큰 재 발급
 *      description: refresh refresh,access 토큰 재 발급
 *      consumes:
 *      - application/json
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: header
 *          name: authorization
 *          required: true
 *          description : user sessionToken
 */
router.post("/reissuance", resendAccesTokenController);

module.exports = router;
