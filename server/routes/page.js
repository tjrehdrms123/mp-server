const { Router } = require("express");
const {
  pageListController,
  pageCreateController,
  pageUpdateController,
  pageDeleteController,
} = require("../controller/page");
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

router.get("/:id", pageListController);
router.post("/:id", pageCreateController);
router.patch("/:id", pageUpdateController);
router.delete("/:id", pageDeleteController);

module.exports = router;
