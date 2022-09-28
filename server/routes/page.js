const { Router } = require("express");
const {
  pageListController,
  pageListAllController,
  pageCreateController,
  pageUpdateController,
  pageDeleteController,
} = require("../controller/page");
const router = Router();
/**
 * @swagger
 *  /page:
 *    get:
 *      tags:
 *      - page
 *      summary: 페이지 전체 가져오기
 *      description: 페이지 전체 가져오기
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
router.get("", pageListAllController);
/**
 * @swagger
 *  /page/:id:
 *    get:
 *      tags:
 *      - page
 *      summary: 한개 페이지 가져오기
 *      description: 한개 페이지 가져오기
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
router.get("/:id", pageListController);
/**
 * @swagger
 *  /page:
 *    post:
 *      tags:
 *      - page
 *      summary: 페이지 등록하기
 *      description: 페이지 등록하기
 *      consumes:
 *      - application/json
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: header
 *          name: authorization
 *          required: true
 *          description : 
 *          schema:
 *              $ref: '#/definitions/UserLogin'
 *        - in: body
 *          name: Body
 *          required: true
 *          description :
 *          schema:
 *              $ref: '#/definitions/PageCreate'
 */
router.post("", pageCreateController);
/**
 * @swagger
 *  /page/:id:
 *    patch:
 *      tags:
 *      - page
 *      summary: 페이지 수정하기
 *      description: 페이지 수정하기
 *      consumes:
 *      - application/json
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: header
 *          name: authorization
 *          required: true
 *          description : Bearer AccessToken
  *        - in: body
 *          name: Body
 *          required: true
 *          description :
 *          schema:
 *              $ref: '#/definitions/PageUpdate'
 */
router.patch("/:id", pageUpdateController);
/**
 * @swagger
 *  /page/:id:
 *    delete:
 *      tags:
 *      - page
 *      summary: 페이지 삭제하기
 *      description: 페이지 삭제하기
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
router.delete("/:id", pageDeleteController);

module.exports = router;
