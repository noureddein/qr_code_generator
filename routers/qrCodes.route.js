const express = require("express");
const router = express.Router();
const qrCodesController = require("../controllers/qrCodes.ctrl");
const validation = require("../validation/index");
const { validateRequest } = require("../middleware/validate.middleware");
const passport = require("passport");

router.use(passport.authenticate("jwt", { session: false }));

router.post(
	"/save",
	[validation.qrCodes.save, validateRequest],
	qrCodesController.save
);

router.delete(
	"/:id",
	[validation.qrCodes.deleteOne, validateRequest],
	qrCodesController.deleteOne
);

router.put(
	"/url/:id",
	[validation.qrCodes.urlUpdateOne, validateRequest],
	qrCodesController.urlUpdateOne
);

router.put(
	"/activation/:id",
	[validation.qrCodes.activationUpdateOne, validateRequest],
	qrCodesController.activationUpdateOne
);

router.get(
	"/:id",
	[validation.qrCodes.getOne, validateRequest],
	qrCodesController.getOne
);

router.get(
	"/",
	[validation.qrCodes.getMany, validateRequest],
	qrCodesController.getMany
);

module.exports = router;
