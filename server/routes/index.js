const express = require("express");
const router = express.Router();

const user = require("./user"); // 유저 관련 라우터
router.use("/user", user); // 유저 관련 라우터

module.exports = router;
