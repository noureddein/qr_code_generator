const mongoose = require("mongoose");
// const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const {
	REFRESH_TOKEN_EXPIRY_IN_SECONDS,
	ACCESS_TOKEN_EXPIRY_IN_SECONDS,
} = require("../constants");
const { isDevelopmentMode } = require("../lib/envMode.lib");

/* 
    We can use joi-password-complexity package to check password complexity
*/

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
			minLength: 5,
			maxLength: 50,
		},
		lastName: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
			minLength: 5,
			maxLength: 50,
		},
		username: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
			minLength: 5,
			maxLength: 50,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			maxLength: 255,
		},
		password: {
			type: String,
			required: true,
			minLength: 8,
			maxLength: 1024,
		},
		isDevelopmentMode: {
			type: Boolean,
			default: isDevelopmentMode(),
		},
		// createdAt: {
		// 	type: Date,
		// 	default: Date.now,
		// },
		// updatedAt: {
		// 	type: Date,
		// 	default: Date.now,
		// },
	},
	{ timestamps: true }
);

userSchema.methods.generateAccessToken = function () {
	const token = jwt.sign(
		{
			_id: this._id,
			email: this.email,
		},
		config.get("access_secret_key"),
		{
			expiresIn: ACCESS_TOKEN_EXPIRY_IN_SECONDS,
		}
	);
	return token;
};

userSchema.methods.generateRefreshToken = function () {
	const token = jwt.sign(
		{
			_id: this._id,
			email: this.email,
		},
		config.get("refresh_secret_key"),
		{
			expiresIn: REFRESH_TOKEN_EXPIRY_IN_SECONDS,
		}
	);
	return token;
};

const User = mongoose.model("User", userSchema);

exports.User = User;
