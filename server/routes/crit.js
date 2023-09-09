const express = require("express");

const critController = require("../controllers/crit.controller");
const authenticate = require("../middlewares/authenticate");
const paginate = require("../middlewares/paginate");

const upload = require("../config/multer");

const router = express.Router();

router.use(authenticate);


router.get("/:critId", critController.getCrit);

router.get("/:critId/engagement", paginate, critController.getCritEngagement);

router.post("/", upload.single("media"), critController.createCrit);

router.post("/:critId/repost", critController.createRepost);

router.post("/:critId/like", critController.likeCrit);

router.delete("/:critId", critController.deleteCrit);

router.delete("/:critId/repost", critController.deleteRepost);

router.delete("/:critId/like", critController.unlikeCrit);

module.exports = router;
