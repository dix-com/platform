const express = require("express");

const critController = require("../controllers/crit.controller");

const upload = require("../config/multer");

const router = express.Router();

router.get("/:critId", critController.getCrit);

router.post("/", upload.single("media"), critController.createCrit);

router.post("/:critId/like", critController.likeCrit);

router.delete("/:critId/like", critController.unlikeCrit);

module.exports = router;
