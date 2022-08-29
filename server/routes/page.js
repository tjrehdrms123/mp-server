const { Router } = require("express");
const router = Router();
const {
  pageFindController,
  pageAddController,
  pageUpdateController,
  pageDeleteController,
} = require("../controller/page");

router.get("/page", pageFindController);
router.post("/page", pageAddController);
router.patch("/page", pageUpdateController);
router.delete("/page", pageDeleteController);

module.exports = router;
