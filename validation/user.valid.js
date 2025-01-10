const { checkSchema } = require("express-validator");
const { User } = require("../models/user.model");
const { isValidId } = require("../startup/db");

const register = checkSchema({
	firstName: {
		in: ["body"],
		trim: true,
		toLowerCase: true,
		notEmpty: {
			errorMessage: "First name is a required field.",
		},
		isLength: {
			options: {
				min: 5,
				max: 50,
			},
			errorMessage: "Username length must be between 5 - 50 characters.",
		},
	},
	lastName: {
		in: ["body"],
		trim: true,
		toLowerCase: true,
		notEmpty: {
			errorMessage: "First name is a required field.",
		},
		isLength: {
			options: {
				min: 5,
				max: 50,
			},
			errorMessage: "Username length must be between 5 - 50 characters.",
		},
	},
	email: {
		in: ["body"],
		exists: true,
		toLowerCase: true,
		trim: true,
		notEmpty: {
			errorMessage: "Email is a required field.",
		},
		isEmail: {
			errorMessage: "Invalid email address.",
		},
		custom: {
			options: async (value) => {
				const isEmailExist = await User.exists({ email: value });
				if (isEmailExist) {
					throw new Error("Email is exist.");
				}
				return true;
			},
		},
	},
	password: {
		in: ["body"],
		exists: true,
		notEmpty: {
			errorMessage: "Password is required.",
		},
		isLength: {
			options: {
				min: 8,
				max: 16,
			},
			errorMessage: "Password length must be between 8 - 16 characters.",
		},
	},
	confirmPassword: {
		in: ["body"],
		exists: true,
		notEmpty: {
			errorMessage: "Confirm password name is required.",
		},
		custom: {
			options: (value, { req }) => {
				// Ensure confirmPassword matches the password field
				if (value !== req.body.password) {
					throw new Error("Passwords do not match.");
				}
				return true;
			},
		},
	},
	username: {
		in: ["body"],
		exists: true,
		trim: true,
		toLowerCase: true,
		isLength: {
			options: {
				min: 5,
				max: 50,
			},
			errorMessage: "Username length must be between 5 - 50 characters.",
		},
		notEmpty: {
			errorMessage: "User name is required.",
		},

		custom: {
			options: async (value) => {
				const isUsernameExist = await User.exists({ username: value });
				if (isUsernameExist) {
					throw new Error("User name is exist.");
				}
				return true;
			},
		},
	},
});

const getOne = checkSchema({
	id: {
		in: ["params"],
		exists: true,
		custom: {
			options: (id) => {
				const isValid = isValidId(id);
				if (!isValid) {
					throw new Error("Invalid user id.");
				}
				return true;
			},
		},
	},
});

const getMe = checkSchema({
	authorization: {
		in: ["headers"],
		exists: true,
	},
});

const profile = checkSchema({
	authorization: {
		in: ["headers"],
		exists: true,
	},
});

module.exports = { register, getOne, getMe, profile };
