const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.ctrl");
const validation = require("../validation/index");
const { validateRequest } = require("../middleware/validate.middleware");
const passport = require("passport");

router.post(
	"/login",
	[validation.auth.login, validateRequest],
	authController.login
);

router.get(
	"/refresh-token",
	[validation.auth.refreshToken, validateRequest],
	authController.refreshToken
);

router.use(passport.authenticate("jwt", { session: false }));

router.post(
	"/logout",
	[validation.auth.logout, validateRequest],
	authController.logout
);

router.get(
	"/identity",
	[validation.auth.identity, validateRequest],
	authController.identity
);

module.exports = router;
