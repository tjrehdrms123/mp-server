const { Router } = require("express");
const router = Router();
const { testController, testTokenController } = require("../controller/test");

router.post("/", testTokenController);

module.exports = router;
