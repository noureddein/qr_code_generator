const express = require("express");
const router = express.Router();
const qrCodesController = require("../controllers/qrCodes.ctrl");
const validation = require("../validation/index");
const {
	validateRequest,
	validatePDFFile,
} = require("../middleware/validate.middleware");
const passport = require("passport");
const { upload } = require("../middleware/multer.middleware");

router.use(passport.authenticate("jwt", { session: false }));

router.post(
	"/save/pdf",
	[
		upload.single("file"),
		validatePDFFile("file"),
		validation.qrCodes.savePDF,
		validateRequest,
	],
	qrCodesController.insertOnePDF
);

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
	"/vcard/:id",
	[validation.qrCodes.vCardUpdateOne, validateRequest],
	qrCodesController.vCardUpdateOne
);

router.put(
	"/text/:id",
	[validation.qrCodes.textUpdateOne, validateRequest],
	qrCodesController.textUpdateOne
);

router.put(
	"/email/:id",
	[validation.qrCodes.emailUpdateOne, validateRequest],
	qrCodesController.emailUpdateOne
);

router.put(
	"/pdf/:id",
	[
		upload.single("file"),
		validatePDFFile("file"),
		validation.qrCodes.updateOnePDF,
		validateRequest,
	],
	qrCodesController.updateOnePDF
);

router.put(
	"/design/:id",
	[
		upload.single("logo"),
		validatePDFFile("logo"),
		validation.qrCodes.updateOneQRCodeDesign,
		validateRequest,
	],
	qrCodesController.updateOneQRCodeDesign
);

router.post(
	"/design/generate",
	[validation.qrCodes.qrCodeDesignGenerate, validateRequest],
	qrCodesController.qrCodeDesignGenerate
);

router.get(
	"/design/:id",
	[validation.qrCodes.getOneQRCodeDesign, validateRequest],
	qrCodesController.getOneQRCodeDesign
);

router.put(
	"/activation",
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
router.post(
	"/delete/bulk",
	[validation.qrCodes.deleteMany, validateRequest],
	qrCodesController.deleteMany
);
module.exports = router;
