const { QR_CODE_TYPE, appEnv } = require("../constants");
const { QrCodes } = require("../models/qrCodes.model");
const {
	generateWithDefault,
	generator,
} = require("../services/qrCodeGenerator.serv");
const { customAlphabet } = require("nanoid");

const DOMAIN =
	process.env.NODE_ENV === appEnv.PRODUCTION
		? process.env.FRONTEND_NETLIFY
		: "http://localhost:5173";

const ALLOWED_STRINGS =
	"1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

async function save(req, res) {
	const { qrData, text, type } = req.body; // TODO: add qrOptions to validation
	const { _id: userId } = req.user;
	const body = req.body;
	console.log({ qrData });
	// TODO: Check if nano id exist for same user
	// TODO: Return error message to let user try again
	const nanoid = customAlphabet(ALLOWED_STRINGS, 10);

	const nanoId = nanoid();
	const publicLink = `${DOMAIN}/${nanoId}`;
	const image = await generateWithDefault(publicLink);

	const savedQRCode = await QrCodes.create({
		userId,
		qrData,
		type,
		image,
		nanoId,
		publicLink,
		qrDesign: {},
	});

	const result = await savedQRCode.save();
	const name = result.qrData.name;
	return res.status(200).json({ message: `\"${name}\" saved` });
}

async function getMany(req, res) {
	const { _id } = req.user;

	const rows = await QrCodes.find({ userId: _id });
	return res.status(200).json({ rows });
}

async function deleteOne(req, res) {
	const { _id } = req.user;
	const { id: paramId } = req.params;
	const result = await QrCodes.deleteOne({
		userId: _id,
		_id: paramId,
	});

	if (result.deletedCount > 0) {
		return res.status(200).json({
			message: "QR Code deleted.",
		});
	} else {
		return res.status(404).json({
			error: "QR Code not found or you don't have permission to delete it.",
		});
	}
}

async function getOne(req, res) {
	const { _id: userId } = req.user;
	const { id: paramId } = req.params;

	const qrCode = await QrCodes.findOne({ _id: paramId, userId }).select(
		"-__v"
	);

	if (!qrCode) {
		return res.status(404).json({ message: "QR Code not found." });
	}

	return res.status(200).json({ row: qrCode });
}

async function urlUpdateOne(req, res) {
	const { _id: userId } = req.user;
	const { id: paramId } = req.params;
	const { name, url } = req.body;

	const result = await QrCodes.findOneAndUpdate(
		{ _id: paramId, userId, type: QR_CODE_TYPE.URL }, // Filter by the document's ID
		{
			$set: {
				"qrData.name": name,
				"qrData.url": url,
				updatedAt: Date.now(),
			},
		},
		{
			new: true, // Return the updated document
			runValidators: true, // Ensure validation rules are applied
		}
	);

	if (!result) {
		return res.status(404).json({ message: "QR Code not found." });
	}
	return res
		.status(200)
		.json({ message: `\"${result.qrData.name}\" QR code Updated.` });
}

async function activationUpdateOne(req, res) {
	const { _id: userId } = req.user;
	const { id: paramId } = req.params;

	const qrCode = await QrCodes.findOne({ _id: paramId, userId }).select(
		"-__v"
	);

	await qrCode.updateOne({
		isActive: !qrCode.isActive,
	});
	return res
		.status(200)
		.json({ message: `${qrCode.qrName} QR code status Updated.` });
}

async function vCardUpdateOne(req, res) {
	const { _id: userId } = req.user;
	const { id: paramId } = req.params;
	const {
		name,
		firstName,
		lastName,
		organization,
		position,
		email,
		website,
		street,
		country,
		state,
		city,
		zipcode,
		fax,
		phoneWork,
		phoneMobile,
		text,
	} = req.body;

	const result = await QrCodes.findOneAndUpdate(
		{ _id: paramId, userId, type: QR_CODE_TYPE.VCARD }, // Filter by the document's ID
		{
			$set: {
				qrData: {
					firstName,
					lastName,
					organization,
					position,
					email,
					website,
					street,
					country,
					state,
					city,
					zipcode,
					fax,
					phoneWork,
					phoneMobile,
					name,
					text,
				},
				updatedAt: Date.now(),
			},
		},
		{
			new: true, // Return the updated document
			runValidators: true, // Ensure validation rules are applied
		}
	);

	if (!result) {
		return res.status(404).json({ message: "QR Code not found." });
	}
	return res
		.status(200)
		.json({ message: `\"${result.qrData.name}\" QR code Updated.` });
}

async function updateOneQRCodeDesign(req, res) {
	const { _id: userId } = req.user;
	const { id } = req.params;
	const { colorDark, colorLight, quietZoneColor, size, dots, quietZone } =
		req.body;

	const qrCode = await QrCodes.findOne({ _id: id, userId }).select(
		"qrDesign publicLink"
	);

	const image = await generator({
		colorDark,
		colorLight,
		quietZoneColor,
		size,
		dots,
		quietZone,
		text: qrCode.publicLink,
	});

	await qrCode.updateOne({
		qrDesign: {
			colorDark,
			colorLight,
			quietZoneColor,
			size,
			dots,
			quietZone,
		},
		image,
	});

	return res.status(200).json({ message: "Design updated." });
}

async function getOneQRCodeDesign(req, res) {
	const { _id: userId } = req.user;
	const { id } = req.params;

	const qrCode = await QrCodes.findOne({ _id: id, userId }).select(
		"qrDesign image"
	);

	return res
		.status(200)
		.json({ qrCodeDesign: qrCode.qrDesign, image: qrCode.image });
}

async function qrCodeDesignGenerate(req, res) {
	const { _id: userId } = req.user;
	const { id, colorDark, colorLight, quietZoneColor, size, dots, quietZone } =
		req.body;

	const qrCode = await QrCodes.findOne({ _id: id, userId }).select(
		"qrData publicLink"
	);
	const image = await generator({
		colorDark,
		colorLight,
		quietZoneColor,
		size,
		dots,
		quietZone,
		text: qrCode.publicLink,
	});

	return res.status(200).json({
		image,
		qrDesign: {
			colorDark,
			colorLight,
			quietZoneColor,
			size,
			dots,
			quietZone,
		},
	});
}

module.exports = {
	save,
	getMany,
	deleteOne,
	getOne,
	urlUpdateOne,
	activationUpdateOne,
	vCardUpdateOne,
	updateOneQRCodeDesign,
	getOneQRCodeDesign,
	qrCodeDesignGenerate,
};
