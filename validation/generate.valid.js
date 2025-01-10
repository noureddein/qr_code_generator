const { checkSchema } = require("express-validator");

const qrCodeDefaultSchema = {
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
};
const urlGenerator = checkSchema({
	text: {
		in: ["body"],
		exists: true,
		isURL: {
			errorMessage: "Invalid URL.",
		},
	},
	...qrCodeDefaultSchema,
});

const textGenerator = checkSchema({
	text: {
		in: ["body"],
		exists: true,
		isString: {
			errorMessage: "Invalid string.",
		},
		notEmpty: {
			errorMessage: "Text cannot be empty.",
		},
	},
	...qrCodeDefaultSchema,
});

const emailGenerator = checkSchema({
	email: {
		in: ["body"],
		exists: true,
		isEmail: {
			errorMessage: "Invalid email address.",
		},
		notEmpty: {
			errorMessage: "Text cannot be empty.",
		},
		toLowerCase: true,
	},
	subject: {
		in: ["body"],
		exists: true,
		isString: {
			errorMessage: "Invalid subject.",
		},
		notEmpty: {
			errorMessage: "Subject cannot be empty.",
		},
		isLength: {
			options: { max: 100 },
			errorMessage: "Subject cannot exceed 100 characters.",
		},
	},
	message: {
		in: ["body"],
		exists: true,
		isString: {
			errorMessage: "Invalid subject.",
		},
		notEmpty: {
			errorMessage: "Subject cannot be empty.",
		},
		isLength: {
			options: { max: 1000 },
			errorMessage: "Message cannot exceed 1000 characters.",
		},
	},
	...qrCodeDefaultSchema,
});

const vCardGenerator = checkSchema({
	...qrCodeDefaultSchema,
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
});

const generate = checkSchema({
	text: {
		in: ["body"],
		exists: true,
		isString: {
			errorMessage: "Invalid string.",
		},
		notEmpty: {
			errorMessage: "Text cannot be empty.",
		},
	},
	...qrCodeDefaultSchema,
});

module.exports = {
	urlGenerator,
	textGenerator,
	emailGenerator,
	vCardGenerator,
	generate,
};
