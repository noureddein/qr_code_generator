const express = require("express");
const router = express.Router();
const publicController = require("../controllers/public.ctrl");
const validation = require("../validation/index");
const { validateRequest } = require("../middleware/validate.middleware");

router.get(
	"/:nanoId",
	[validation.public.getOne, validateRequest],
	publicController.getOne
);

module.exports = router;
