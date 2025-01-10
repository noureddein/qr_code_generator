const mongoose = require("mongoose");

const qrCodesSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	data: {
		type: Object,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	publicLink: {
		type: String,
		required: true,
	},
	qrName: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	isActive: {
		type: Boolean,
		default: true,
	},
});

const QrCodes = mongoose.model("QrCodes", qrCodesSchema);

exports.QrCodes = QrCodes;
