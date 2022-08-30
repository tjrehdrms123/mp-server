const express = require("express");
const router = express.Router();

const user = require("./user"); // 유저 관련 라우터
const auth = require("./auth"); // 인증 관련 라우터
const token = require("./token");
router.use("/user", user); // 유저 관련 라우터
router.use("/auth", auth);
router.use("/token", token);

module.exports = router;
