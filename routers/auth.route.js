const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.ctrl");
const validation = require("../validation/index");
const { validateRequest } = require("../middleware/validate.middleware");
const passport = require("passport");
const { requiresAuth } = require("express-openid-connect");
const { checkJwt } = require("../startup/middleware");

router.get("/callback", (req, res) => {
	console.log({ oidc: req.oidc });
	return res.oidc.callback({
		redirectUri: "http://localhost:5173/my-codes",
	});
});

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

router.get("/check", checkJwt, (req, res) => {
	return res.status(200).json({ message: "Authorized." });
});

module.exports = router;
