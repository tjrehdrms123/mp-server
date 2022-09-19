const { Router } = require("express");
const { homepageController } = require("../controller/homepage");
const router = Router();
router.get("/", homepageController);

module.exports = router;
