const { QR_CODE_TYPE, appEnv } = require("../constants");
const { QrCodes } = require("../models/qrCodes.model");
const { generateWithDefault } = require("../services/qrCodeGenerator.serv");
const { customAlphabet } = require("nanoid");

const DOMAIN =
	process.env.NODE_ENV === appEnv.PRODUCTION
		? process.env.FRONTEND_PROD_RENDER
		: "http://localhost:5173/";

const ALLOWED_STRINGS =
	"1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

async function save(req, res) {
	const { data, type, qrOptions } = req.body; // TODO: add qrOptions to validation
	const { _id } = req.user;

	const nanoid = customAlphabet(ALLOWED_STRINGS, 10);

	const publicLink = DOMAIN + nanoid();
	const image = await generateWithDefault(publicLink);

	const savedQRCode = await QrCodes.create({
		data,
		type,
		image,
		userId: _id,
		publicLink,
		qrName: qrOptions.qrName,
	});

	const result = await savedQRCode.save();

	return res.status(200).json({ message: "Saved", result, publicLink });
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
	const { qrName, url } = req.body;

	const result = await QrCodes.findOneAndUpdate(
		{ _id: paramId, userId }, // Filter by the document's ID
		{
			$set: {
				qrName: qrName,
				"data.qrName": qrName,
				"data.url": url,
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
		.json({ message: `\"${result.qrName}\" QR code Updated.` });
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

module.exports = {
	save,
	getMany,
	deleteOne,
	getOne,
	urlUpdateOne,
	activationUpdateOne,
};
