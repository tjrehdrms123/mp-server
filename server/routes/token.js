const { Router } = require("express");
const router = Router();
const {
  tokenValidationController,
  refreshTokenValidationController,
  resendAccesTokenController,
} = require("../controller/token");

router.post("/validation", tokenValidationController);
router.post("/validation/refresh", refreshTokenValidationController);
router.post("/refresh", resendAccesTokenController);

module.exports = router;
