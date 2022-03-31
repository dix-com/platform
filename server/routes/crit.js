const express = require("express");

const critController = require("../controllers/crit.controller");
const isAuthenticated = require("../middlewares/isAuthenticated");
const paginate = require("../middlewares/paginateMiddleware");

const upload = require("../config/multer");

const router = express.Router();

router.use(isAuthenticated);

router.get("/:critId", critController.getCrit);

router.post("/", upload.single("media"), critController.createCrit);

router.post("/:critId/repost", critController.createRepost);

router.post("/:critId/like", critController.likeCrit);

router.delete("/:critId", critController.deleteCrit);

router.delete("/:critId/repost", critController.deleteRepost);

router.delete("/:critId/like", critController.unlikeCrit);

module.exports = router;
