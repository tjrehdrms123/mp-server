const { Router } = require("express");
const {
  boardListController,
  boardCreateController,
  boardUpdateController,
  boardDeleteController,
} = require("../controller/board");
const router = Router();
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

router.get("/:id", boardListController);
router.post("/:id", boardCreateController);
router.patch("/:id", boardUpdateController);
router.delete("/:id", boardDeleteController);

module.exports = router;
