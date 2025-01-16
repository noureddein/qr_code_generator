const { checkSchema } = require("express-validator");
const mongoose = require("mongoose");
const { SORT_KEYS, QR_CODE_TYPE } = require("../constants");

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
	q: {
		in: ["query"],
		optional: true,
		isString: true,
	},
	sort: {
		in: ["query"],
		optional: true,
		isString: true,
		default: {
			options: SORT_KEYS.LAST_CREATED,
		},
	},
	type: {
		in: ["query"],
		optional: true,
		isString: true,
		default: {
			options: "",
		},
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
	name: {
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

const vCardUpdateOne = checkSchema({
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
	name: {
		in: ["body"],
		exists: true,
	},
	firstName: {
		in: ["body"],
		exists: true,
		trim: true,
		isLength: {
			options: { max: 50, min: 3 },
			errorMessage: "Subject cannot exceed 3 - 50 characters.",
		},
	},
	lastName: {
		in: ["body"],
		exists: false,
		trim: true,
		isLength: {
			options: { max: 50 },
			errorMessage: "Last name cannot exceed 50 characters.",
		},
		optional: true,
	},
	organization: {
		in: ["body"],
		exists: false,
		trim: true,
		isLength: {
			options: { max: 50 },
			errorMessage: "Organization cannot exceed 50 characters.",
		},
	},
	position: {
		in: ["body"],
		exists: false,
		trim: true,
		isLength: {
			options: { max: 50 },
			errorMessage: "Position cannot exceed 50 characters.",
		},
	},

	email: {
		in: ["body"],
		exists: {
			errorMessage: "The email field is required.", // Ensures the key exists
		},
		trim: true, // Trim whitespace
		toLowerCase: true, // Convert to lowercase
		custom: {
			options: (value) => {
				// Allow empty strings or valid emails
				return value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
			},
			errorMessage: "Must be a valid email address or empty.",
		},
	},
	website: {
		in: ["body"],
		optional: true,
		trim: true,
		toLowerCase: true,
		custom: {
			options: (value) => {
				// Allow empty string or valid URL
				return (
					value === "" || /^https?:\/\/[^\s$.?#].[^\s]*$/i.test(value)
				);
			},
			errorMessage: "Must be a valid URL or empty.",
		},
	},
	street: {
		in: ["body"],
		exists: {
			errorMessage: "The street field is required.", // Ensures the key exists
		},
		trim: true,
		isLength: {
			options: { max: 50 },
			errorMessage: "Subject cannot exceed 50 characters.",
		},
		isString: true,
	},
	country: {
		in: ["body"],
		exists: {
			errorMessage: "The country field is required.", // Ensures the key exists
		},
		trim: true,
		isLength: {
			options: { max: 50 },
			errorMessage: "Subject cannot exceed 50 characters.",
		},
		isString: true,
	},
	state: {
		in: ["body"],
		exists: {
			errorMessage: "The state field is required.", // Ensures the key exists
		},
		trim: true,
		isLength: {
			options: { max: 50 },
			errorMessage: "Subject cannot exceed 50 characters.",
		},
		isString: true,
	},
	city: {
		in: ["body"],
		exists: {
			errorMessage: "The city field is required.", // Ensures the key exists
		},
		trim: true,
		isLength: {
			options: { max: 50 },
			errorMessage: "Subject cannot exceed 50 characters.",
		},
		isString: true,
	},
	zipcode: {
		in: ["body"],
		trim: true,
		exists: {
			errorMessage: "The zip code field is required.", // Ensures the key exists
		},
		isInt: {
			errorMessage: "Zip code must be a number.",
		},
		optional: {
			options: { nullable: true, checkFalsy: true }, // Allows null or empty values
		},
	},
	fax: {
		in: ["body"],
		trim: true,
		exists: {
			errorMessage: "The fax field is required.", // Ensures the key exists
		},
		optional: {
			options: { nullable: true, checkFalsy: true }, // Allows null or empty values
		},
		isInt: {
			errorMessage: "Fax must be a number.",
		},
	},
	phoneWork: {
		in: ["body"],
		trim: true,
		exists: {
			errorMessage: "The Work phone field is required.", // Ensures the key exists
		},
		isInt: {
			errorMessage: "Work phone must be a number.",
		},
		optional: {
			options: { nullable: true, checkFalsy: true }, // Allows null or empty values
		},
	},
	phoneMobile: {
		in: ["body"],
		trim: true,
		exists: {
			errorMessage: "The mobile phone field is required.", // Ensures the key exists
		},
		isInt: {
			errorMessage: "Mobile phone must be a number.",
		},
		optional: {
			options: { nullable: true, checkFalsy: true }, // Allows null or empty values
		},
	},
	text: {
		in: ["body"],
		exists: {
			errorMessage: "The text field is required.", // Ensures the key exists
		},
		trim: true,
		isString: true,
		isEmpty: false,
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

const updateOneQRCodeDesign = checkSchema({
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
	colorDark: {
		in: ["body"],
		exists: true,
		isHexColor: {
			errorMessage: "Invalid hex color for color dark.",
		},
	},
	colorLight: {
		in: ["body"],
		exists: true,
		isHexColor: {
			errorMessage: "Invalid hex color for color light.",
		},
	},
	quietZoneColor: {
		in: ["body"],
		exists: false,
		isHexColor: {
			errorMessage: "Invalid HEX color for Quiet Zone Color.",
		},
		optional: true,
	},
	size: {
		in: ["body"],
		exists: true,
		isInt: {
			errorMessage: "Invalid size value, Min. 200 and Max. 2000",
			options: {
				min: 200,
				max: 2000,
			},
		},
	},
	dots: {
		in: ["body"],
		exists: true,
		isDecimal: {
			errorMessage: "Invalid dots value, Min. 0.1 and Max. 1.0",
			options: {
				min: 0.1,
				max: 1.0,
			},
		},
	},
	quietZone: {
		exists: true,
		isInt: {
			errorMessage: "Invalid size value, Min. 200 and Max. 2000",
			options: {
				min: 0,
				max: 200,
			},
		},
	},
});

const getOneQRCodeDesign = checkSchema({
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

const qrCodeDesignGenerate = checkSchema({
	authorization: {
		in: ["headers"],
		exists: true,
	},
	id: {
		in: ["body"],
		exists: true,
		custom: {
			options: (value) => {
				return mongoose.Types.ObjectId.isValid(value);
			},
			errorMessage: "Invalid Object id.",
		},
	},
	colorDark: {
		in: ["body"],
		exists: true,
		isHexColor: {
			errorMessage: "Invalid hex color for color dark.",
		},
	},
	colorLight: {
		in: ["body"],
		exists: true,
		isHexColor: {
			errorMessage: "Invalid hex color for color light.",
		},
	},
	quietZoneColor: {
		in: ["body"],
		exists: false,
		isHexColor: {
			errorMessage: "Invalid HEX color for Quiet Zone Color.",
		},
		optional: true,
	},
	size: {
		in: ["body"],
		exists: true,
		isInt: {
			errorMessage: "Invalid size value, Min. 200 and Max. 2000",
			options: {
				min: 200,
				max: 2000,
			},
		},
	},
	dots: {
		in: ["body"],
		exists: true,
		isDecimal: {
			errorMessage: "Invalid dots value, Min. 0.1 and Max. 1.0",
			options: {
				min: 0.1,
				max: 1,
			},
		},
	},
	quietZone: {
		exists: true,
		isInt: {
			errorMessage: "Invalid size value, Min. 200 and Max. 2000",
			options: {
				min: 0,
				max: 200,
			},
		},
	},
});

const textUpdateOne = checkSchema({
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
	name: {
		in: ["body"],
		exists: true,
	},
	text: {
		in: ["body"],
		exists: {
			errorMessage: "URL is required.",
		},
		isLength: {
			options: { max: 2500, min: 0 },
			errorMessage: "Text cannot exceed 2500 characters.",
		},
	},
});

const emailUpdateOne = checkSchema({
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
	name: {
		in: ["body"],
		exists: true,
	},
	message: {
		in: ["body"],
		exists: {
			errorMessage: "Message is required.",
		},
		isLength: {
			options: { max: 2500, min: 0 },
			errorMessage: "Message cannot exceed 2500 characters.",
		},
	},
	subject: {
		in: ["body"],
		exists: {
			errorMessage: "Subject is required.",
		},
		isLength: {
			options: { max: 256, min: 0 },
			errorMessage: "Subject cannot exceed 256 characters.",
		},
	},
	email: {
		in: ["body"],
		exists: {
			errorMessage: "The email field is required.", // Ensures the key exists
		},
		trim: true, // Trim whitespace
		toLowerCase: true, // Convert to lowercase
		custom: {
			options: (value) => {
				// Allow empty strings or valid emails
				return value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
			},
			errorMessage: "Must be a valid email address or empty.",
		},
	},
});

const downloadVCard = checkSchema({
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
	vCardUpdateOne,
	updateOneQRCodeDesign,
	getOneQRCodeDesign,
	qrCodeDesignGenerate,
	textUpdateOne,
	emailUpdateOne,
	downloadVCard,
};
