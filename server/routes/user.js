const { Router } = require("express");
const router = Router();

const axios = require("axios");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Parse = require("parse/node");
const path = require("path");

const config = require("../config");

Parse.initialize(
  config.parseAppId,
  config.parseJavascriptKey,
  config.parseMasterKey
);
Parse.serverURL = config.parseServerURL;
Parse.User.enableUnsafeCurrentUser();

/**
 * @swagger
 *  /user/signup:
 *    post:
 *      tags:
 *      - admin
 *      summary: test 로그인
 *      description: test 로그인
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
 *              $ref: '#/definitions/AdminLogin'
 */
router.get("/signup", (req, res) => {
  return res.status(200).send({
    content: "test",
    data: null,
  });
});

module.exports = router;
