const { checkSchema } = require("express-validator");
const mongoose = require("mongoose");

//TODO Validate all values when save
const save = checkSchema({
	authorization: {
		in: ["headers"],
		exists: true,
	},
	type: {
		in: ["body"],
		exists: true,
		isString: {
			errorMessage: "Type must be a string",
		},
	},
});

const getMany = checkSchema({
	authorization: {
		in: ["headers"],
		exists: true,
	},
});

const deleteOne = checkSchema({
	authorization: {
		in: ["headers"],
		exists: true,
	},
	id: {
		in: ["params"],
		exists: true,
		custom: {
			options: (value) => {
				return mongoose.Types.ObjectId.isValid(value);
			},
			errorMessage: "Invalid Object id.",
		},
	},
});

const getOne = checkSchema({
	authorization: {
		in: ["headers"],
		exists: true,
	},
	id: {
		in: ["params"],
		exists: true,
		custom: {
			options: (value) => {
				return mongoose.Types.ObjectId.isValid(value);
			},
			errorMessage: "Invalid Object id.",
		},
	},
});

const urlUpdateOne = checkSchema({
	authorization: {
		in: ["headers"],
		exists: true,
	},
	id: {
		in: ["params"],
		exists: true,
		custom: {
			options: (value) => {
				return mongoose.Types.ObjectId.isValid(value);
			},
			errorMessage: "Invalid Object id.",
		},
	},
	qrName: {
		in: ["body"],
		exists: true,
	},
	url: {
		in: ["body"],
		isURL: {
			errorMessage: "Invalid URL.",
		},
		exists: {
			errorMessage: "URL is required.",
		},
	},
});

const activationUpdateOne = checkSchema({
	authorization: {
		in: ["headers"],
		exists: true,
	},
	id: {
		in: ["params"],
		exists: true,
		custom: {
			options: (value) => {
				return mongoose.Types.ObjectId.isValid(value);
			},
			errorMessage: "Invalid Object id.",
		},
	},
});

module.exports = {
	save,
	getMany,
	deleteOne,
	getOne,
	urlUpdateOne,
	activationUpdateOne,
};
