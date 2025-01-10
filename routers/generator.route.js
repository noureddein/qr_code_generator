const express = require("express");
const router = express.Router();
const validation = require("../validation/index");
const { validateRequest } = require("../middleware/validate.middleware");
const generatorController = require("../controllers/generator.ctrl");

router.post(
	"/",
	[validation.generate.generate, validateRequest],
	generatorController.generateQRCode
);

// router.post(
// 	"/url",
// 	[validation.generate.urlGenerator, validateRequest],
// 	generatorController.url
// );

// router.post(
// 	"/text",
// 	[validation.generate.textGenerator, validateRequest],
// 	generatorController.text
// );

// router.post(
// 	"/email",
// 	[validation.generate.emailGenerator, validateRequest],
// 	generatorController.email
// );

// router.post(
// 	"/vcard",
// 	[validation.generate.vCardGenerator, validateRequest],
// 	generatorController.vCard
// );

module.exports = router;
