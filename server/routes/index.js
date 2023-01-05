const express = require("express");
const router = express.Router();

const user = require("./user"); // 유저 관련 라우터
const auth = require("./auth"); // 인증 관련 라우터
const token = require("./token"); // JWT 라우터
const page = require("./page");// 페이지 라우터
const test = require("./test");// 테스트 라우터 추후 TDD 진행 예정
router.use("/user", user);
router.use("/auth", auth);
router.use("/token", token);
router.use("/page", page);
router.use("/test", test);

module.exports = router;
