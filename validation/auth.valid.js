const { checkSchema, check } = require("express-validator");
const { User } = require("../models/user.model");

const login = checkSchema({
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
				if (!isEmailExist) {
					throw new Error("Invalid credentials.");
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
		errorMessage: "Invalid credentials.",
	},
});

const identity = checkSchema({
	refreshToken: {
		in: ["cookies"],
		exists: true,
		isJWT: {
			errorMessage: "Invalid JWT.",
		},
	},
});

const logout = checkSchema({
	refreshToken: {
		in: ["cookies"],
		exists: true,
		isJWT: {
			errorMessage: "Invalid JWT.",
		},
	},
});

const refreshToken = checkSchema({
	refreshToken: {
		in: ["cookies"],
		exists: true,
		isJWT: {
			errorMessage: "Invalid JWT.",
		},
	},
});

module.exports = { login, identity, logout, refreshToken };
