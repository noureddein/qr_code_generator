const {
	QR_CODE_TYPE,
	appEnv,
	DEFAULT_QR_DATA,
	SORT_KEYS,
} = require("../constants");
const { createVCard } = require("../lib/cards");
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
	const { qrData, type } = req.body;
	const { _id: userId } = req.user;

	const nanoid = customAlphabet(ALLOWED_STRINGS, 10);
	const nanoId = nanoid();
	const publicLink = `${DOMAIN}/${nanoId}`;
	const image = await generateWithDefault(publicLink);

	let dataToSave = {};

	switch (type) {
		case QR_CODE_TYPE.EMAIL:
			dataToSave = {
				email: qrData?.email || DEFAULT_QR_DATA.email.email,
				subject: qrData?.subject || DEFAULT_QR_DATA.email.subject,
				message: qrData?.message || DEFAULT_QR_DATA.email.message,
				text: qrData?.text || DEFAULT_QR_DATA.email.text,
				name: qrData?.name || DEFAULT_QR_DATA.email.name,
			};
			break;

		case QR_CODE_TYPE.TEXT:
			dataToSave = {
				name: qrData.name || DEFAULT_QR_DATA.text.name,
				text: qrData.text || DEFAULT_QR_DATA.text.text,
			};
			break;

		case QR_CODE_TYPE.URL:
			dataToSave = {
				url: qrData?.url || DEFAULT_QR_DATA.url.url,
				name: qrData?.name || DEFAULT_QR_DATA.url.name,
				text: qrData?.text || DEFAULT_QR_DATA.url.text,
			};
			break;

		case QR_CODE_TYPE.VCARD:
			dataToSave = {
				name: qrData?.name || DEFAULT_QR_DATA.vCard,
				firstName: qrData?.firstName || DEFAULT_QR_DATA.vCard,
				lastName: qrData?.lastName || DEFAULT_QR_DATA.vCard,
				organization: qrData?.email || DEFAULT_QR_DATA.vCard,
				position: qrData?.position || DEFAULT_QR_DATA.vCard,
				phoneWork: qrData?.phoneWork || DEFAULT_QR_DATA.vCard,
				phoneMobile: qrData?.phoneMobile || DEFAULT_QR_DATA.vCard,
				fax: qrData?.fax || DEFAULT_QR_DATA.vCard,
				email: qrData?.email || DEFAULT_QR_DATA.vCard,
				website: qrData?.website || DEFAULT_QR_DATA.vCard,
				street: qrData?.street || DEFAULT_QR_DATA.vCard,
				zipcode: qrData?.zipcode || DEFAULT_QR_DATA.vCard,
				city: qrData?.city || DEFAULT_QR_DATA.vCard,
				state: qrData?.state || DEFAULT_QR_DATA.vCard,
				country: qrData?.country || DEFAULT_QR_DATA.vCard,
			};
			dataToSave.text = createVCard(dataToSave).getFormattedString();
			break;

		default:
			return res
				.status(404)
				.json({ message: "Type of qr code not exist" });
	}

	const savedQRCode = await QrCodes.create({
		userId,
		qrData: {
			...dataToSave,
			name: dataToSave.name.toLowerCase(),
		},
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
	const { q = "", sort = "", type = "" } = req.query;

	let sortBy = {};
	let filterBy = Object.values(QR_CODE_TYPE).includes(type) ? type : null;

	switch (sort) {
		case SORT_KEYS.LAST_CREATED:
			sortBy = { createdAt: -1 };
			break;

		case SORT_KEYS.NAME_ASC:
			sortBy = { "qrData.name": 1 };
			break;

		case SORT_KEYS.NAME_DESC:
			sortBy = { "qrData.name": -1 };
			break;

		default:
			sortBy = { createdAt: -1 }; // Default case
			break;
	}
	const rows = await QrCodes.find({
		userId: _id,
		...(!!q && { "qrData.name": { $regex: q, $options: "i" } }),
		...(!!filterBy && { type }),
	}).sort(sortBy);
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
				"qrData.name": name.toLowerCase(),
				"qrData.url": url,
				"qrData.text": url,
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
					name: name.toLowerCase(),
					text: createVCard(req.body).getFormattedString(),
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

async function textUpdateOne(req, res) {
	const { _id: userId } = req.user;
	const { id: paramId } = req.params;
	const { name, text } = req.body;

	const result = await QrCodes.findOneAndUpdate(
		{ _id: paramId, userId, type: QR_CODE_TYPE.TEXT }, // Filter by the document's ID
		{
			$set: {
				"qrData.name": name.toLowerCase(),
				"qrData.text": text,
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

async function emailUpdateOne(req, res) {
	const { _id: userId } = req.user;
	const { id: paramId } = req.params;
	const { email, message, name, subject } = req.body;
	console.log({
		userId,
		paramId,
	});
	const result = await QrCodes.findOneAndUpdate(
		{ _id: paramId, userId, type: QR_CODE_TYPE.EMAIL }, // Filter by the document's ID
		{
			$set: {
				"qrData.name": name.toLowerCase(),
				"qrData.email": email,
				"qrData.subject": subject,
				"qrData.message": message,
				"qrData.text": `mailto:${email}?subject=${subject}&body=${message}`,
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

async function downloadVCard(req, res) {
	const { id } = req.params;

	const qrCode = await QrCodes.findOne({
		_id: id,
		type: QR_CODE_TYPE.VCARD,
	}).select("qrData");
	console.log({ qrCode });

	if (!qrCode) {
		return res.status(404).json({ message: "vCard not found." });
	}

	const file = createVCard(qrCode).saveToFile(qrCode?.name || "vcard.vcf");

	return res.status(200).json({ file });
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
	textUpdateOne,
	emailUpdateOne,
	downloadVCard,
};
