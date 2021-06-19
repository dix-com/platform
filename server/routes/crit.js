const express = require("express");

const critController = require("../controllers/crit.controller");
const upload = require("../config/multerConfig");

const router = express.Router();

router.get("/:critId", critController.getCrit);

router.get("/:critId/liking_users", critController.getLikingUsers);

router.post("/", upload.single("media"), critController.createCrit);

router.post("/reply", critController.createReply);

router.post("/recrit", critController.createRecrit);

router.post("/:critId/like", critController.likeCrit);

router.delete("/:critId/like", critController.unlikeCrit);

router.delete("/:id", critController.deleteCrit);
// ("/:id", critController.getCrit, critController.deleteCrit);

module.exports = router;
