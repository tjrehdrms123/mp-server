const { Router } = require("express");
const router = Router();
const { testController } = require("../controller/test");

router.post("/", testController);

module.exports = router;
