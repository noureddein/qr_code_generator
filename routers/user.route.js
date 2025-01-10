const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.ctrl");
const validation = require("../validation/index");
const { validateRequest } = require("../middleware/validate.middleware");
const passport = require("passport");

router.post(
	"/register",
	[validation.user.register, validateRequest],
	userController.register
);

router.use(passport.authenticate("jwt", { session: false }));

router.get(
	"/me",
	[validation.user.getMe, validateRequest],
	userController.getMe
);

router.get(
	"/profile",
	[validation.user.profile, validateRequest],
	userController.profile
);

router.get(
	"/:id",
	[validation.user.getOne, validateRequest],
	userController.getOne
);

module.exports = router;
