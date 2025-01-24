const {
	QR_CODE_TYPE,
	appEnv,
	DEFAULT_QR_DATA,
	SORT_KEYS,
	STORAGE_FOLDERS_NAME,
} = require("../constants");
const { createVCard } = require("../lib/cards");
const { QrCodes } = require("../models/qrCodes.model");
const { generator } = require("../lib/qrCodeGenerator.lib");
const { customAlphabet } = require("nanoid");
const {
	fileUploader,
	deleteUploadedFile,
	imageUploader,
	fetchResources,
} = require("../services/cloudinary.serv");
const _omit = require("lodash/omit");
const { removeUploadedFiles } = require("../services/removeFiles.ser");
const { isDevelopmentMode } = require("../lib/envMode.lib");

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
	const image = await generator({ text: publicLink });

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
				name: qrData?.name || DEFAULT_QR_DATA.vCard.name,
				firstName: qrData?.firstName || DEFAULT_QR_DATA.vCard.firstName,
				lastName: qrData?.lastName || DEFAULT_QR_DATA.vCard.lastName,
				organization:
					qrData?.organization || DEFAULT_QR_DATA.vCard.organization,
				position: qrData?.position || DEFAULT_QR_DATA.vCard.position,
				phoneWork: qrData?.phoneWork || DEFAULT_QR_DATA.vCard.phoneWork,
				phoneMobile:
					qrData?.phoneMobile || DEFAULT_QR_DATA.vCard.phoneMobile,
				fax: qrData?.fax || DEFAULT_QR_DATA.vCard.fax,
				email: qrData?.email || DEFAULT_QR_DATA.vCard.email,
				website: qrData?.website || DEFAULT_QR_DATA.vCard.website,
				street: qrData?.street || DEFAULT_QR_DATA.vCard.street,
				zipcode: qrData?.zipcode || DEFAULT_QR_DATA.vCard.zipcode,
				city: qrData?.city || DEFAULT_QR_DATA.vCard.city,
				state: qrData?.state || DEFAULT_QR_DATA.vCard.state,
				country: qrData?.country || DEFAULT_QR_DATA.vCard.country,
				imageBase64:
					qrData?.imageBase64 || DEFAULT_QR_DATA.vCard.imageBase64,
				imageType: qrData?.imageType || DEFAULT_QR_DATA.vCard.imageType,
				text: qrData?.text || DEFAULT_QR_DATA.vCard.text,
			};

			break;

		default:
			return res
				.status(404)
				.json({ message: "Type of qr code not supported" });
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
		isDevelopmentMode: isDevelopmentMode(),
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

	const qrCode = await QrCodes.findOne({
		_id: paramId,
		userId,
		isDevelopmentMode: isDevelopmentMode(),
	}).select("-__v");

	if (!qrCode) {
		return res.status(404).json({ message: "QR Code not found." });
	}

	if (qrCode.type === QR_CODE_TYPE.PDF) {
		return res
			.status(200)
			.json({ row: _omit(qrCode, "qrData.pdfUploadResult") });
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
		imageBase64,
		imageType,
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
					name: name.toLowerCase(),
					imageBase64:
						imageBase64 || DEFAULT_QR_DATA.vCard.imageBase64,
					imageType: imageType || DEFAULT_QR_DATA.vCard.imageType,
					text: text || DEFAULT_QR_DATA.vCard.text,
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
	const {
		colorDark,
		colorLight,
		quietZoneColor,
		size,
		dots,
		quietZone,
		logoBase64,
	} = req.body;

	const qrCode = await QrCodes.findOne({ _id: id, userId }).select(
		"qrDesign publicLink"
	);

	const image = await generator({
		optionsProps: {
			colorDark,
			colorLight,
			quietZoneColor,
			size,
			dots,
			quietZone,
			logoBase64:
				logoBase64 === "" || logoBase64
					? logoBase64
					: qrCode.qrDesign.logoBase64,
		},
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
			logoBase64:
				logoBase64 === "" || logoBase64
					? logoBase64
					: qrCode.qrDesign.logoBase64,
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

	const icons = await fetchResources(STORAGE_FOLDERS_NAME.ICONS);

	const iconsUrl = icons.resources.map((icon) => icon.secure_url);

	return res.status(200).json({
		qrCodeDesign: qrCode.qrDesign,
		image: qrCode.image,
		icons: iconsUrl,
	});
}

async function qrCodeDesignGenerate(req, res) {
	const { _id: userId } = req.user;
	const {
		id,
		colorDark,
		colorLight,
		quietZoneColor,
		size,
		dots,
		quietZone,
		logoBase64,
	} = req.body;
	console.log({ logoBase64 });
	const qrCode = await QrCodes.findOne({ _id: id, userId }).select(
		"qrData publicLink qrDesign"
	);
	const image = await generator({
		optionsProps: {
			colorDark,
			colorLight,
			quietZoneColor,
			size,
			dots,
			quietZone,
			logoBase64:
				logoBase64 === "" || logoBase64
					? logoBase64
					: qrCode.qrDesign.logoBase64,
		},
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
			logoBase64: logoBase64 === "" ? "" : qrCode.qrDesign.logoBase64,
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

async function activationUpdateOne(req, res) {
	const { _id: userId } = req.user;
	const { ids, status } = req.body;

	const result = await QrCodes.updateMany(
		{
			_id: { $in: ids },
			userId,
		},
		{
			isActive: status,
		}
	);

	if (result.acknowledged) {
		return res.status(200).json({ message: `QR codes status Updated.` });
	} else {
		return res.status(500).json({ message: "Unable to update status." });
	}
}

async function deleteMany(req, res) {
	const { ids } = req.body;
	const { _id: userId } = req.user;
	const message =
		ids.length > 1 ? "All selected QR codes deleted." : "QR code deleted.";

	const pdfQrCodeRecords = await QrCodes.find({
		_id: { $in: ids },
		type: QR_CODE_TYPE.PDF,
	}).select("qrData");

	if (pdfQrCodeRecords.length > 0) {
		const publicIds = pdfQrCodeRecords.map(
			(pdf) => pdf.qrData.pdfUploadResult.public_id
		);
		const createRequests = publicIds.map((id) => deleteUploadedFile(id));
		await Promise.all(createRequests);
	}

	const result = await QrCodes.deleteMany({
		_id: { $in: ids },
		userId,
	});

	if (result?.acknowledged) {
		return res.status(200).json({ message });
	} else {
		return res.status(500).json({ message: "Unable to delete." });
	}
}

async function insertOnePDF(req, res) {
	const { _id: userId } = req.user;
	const { name } = req.body;

	const file = req.body.file;

	// TODO: Remove file from /uploads
	const uploadResponse = await fileUploader(
		process.cwd() + "/uploads/" + file.filename
	);

	removeUploadedFiles([file.filename]);

	const nanoid = customAlphabet(ALLOWED_STRINGS, 10);
	const nanoIdKey = nanoid();
	const publicLink = `${DOMAIN}/${nanoIdKey}`;
	const image = await generator({ text: publicLink });

	const savedQRCode = await QrCodes.create({
		userId,
		qrData: {
			name,
			text: uploadResponse.secure_url,
			pdfUploadResult: uploadResponse,
		},
		type: QR_CODE_TYPE.PDF,
		image,
		nanoId: nanoIdKey,
		publicLink,
		qrDesign: {},
	});

	const result = await savedQRCode.save();
	const qrName = result.qrData.name;

	return res.status(200).json({ message: `\"${qrName}\" saved` });
}

async function updateOnePDF(req, res) {
	const { _id: userId } = req.user;
	const { id: paramId } = req.params;
	const { name } = req.body;

	const file = req.file;
	const qrCodeRecord = await QrCodes.findOne({
		userId,
		_id: paramId,
		type: QR_CODE_TYPE.PDF,
	});

	if (!qrCodeRecord) {
		return res.status(404).json({ message: "QR Code not found." });
	}

	let dataToSave = {
		"qrData.name": name,
	};

	if (file) {
		const uploadResponse = await fileUploader(
			process.cwd() + "/uploads/" + file.filename
		);

		// Remove old file
		await deleteUploadedFile(qrCodeRecord.qrData.pdfUploadResult.public_id);

		removeUploadedFiles([file.filename]);

		dataToSave = {
			...dataToSave,
			"qrData.text": uploadResponse.secure_url,
			"qrData.pdfUploadResult": uploadResponse,
		};
	}

	const result = await QrCodes.findOneAndUpdate(
		{ _id: paramId, userId, type: QR_CODE_TYPE.PDF }, // Filter by the document's ID
		{
			$set: {
				...dataToSave,
				updatedAt: Date.now(),
			},
		},
		{
			new: true, // Return the updated document
			runValidators: true, // Ensure validation rules are applied
		}
	).select("qrData");

	return res
		.status(200)
		.json({ message: `\"${result.qrData.name}\" updated.` });
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
	deleteMany,
	insertOnePDF,
	updateOnePDF,
};
