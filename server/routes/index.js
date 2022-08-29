const express = require("express");
const router = express.Router();

const user = require("./user"); // 유저 관련 라우터
const auth = require("./auth"); // 인증 관련 라우터
const page = require("./page"); // 페이지 관련 라우터
router.use("/user", user); // 유저 관련 라우터
router.use("/auth", auth);
router.use("/page", page);

module.exports = router;
