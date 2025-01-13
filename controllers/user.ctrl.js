const { User } = require("../models/user.model");
const bcrypt = require("bcrypt");
const config = require("config");
const _omit = require("lodash/omit");
const _pick = require("lodash/pick");
const { REFRESH_TOKEN_EXPIRY_IN_MILLISECOND } = require("../constants");

const SALT_ROUNDS = config.get("salt_rounds");

async function register(req, res) {
	const { firstName, lastName, email, password, username } = req.body;

	const hashedPassword = bcrypt.hashSync(password, +SALT_ROUNDS);

	const user = new User({
		username,
		email,
		firstName,
		lastName,
		password: hashedPassword,
	});

	await user.save();

	const accessToken = user.generateAccessToken();
	const refreshToken = user.generateRefreshToken();

	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		maxAge: REFRESH_TOKEN_EXPIRY_IN_MILLISECOND,
		secure: true,
		sameSite: "none",
	});

	return res.status(200).send({
		message: "User created successfully.",
		user: _pick(user, ["username", "email", "firstName", "lastName"]),
		accessToken,
	});
}

async function getOne(req, res) {
	const { id } = req.params;

	const user = await User.findById(id).select("-password -__v");

	if (!user) {
		return res.status(409).send({ message: "User not found." });
	}

	return res
		.status(200)
		.send({ message: "User created successfully.", user });
}

async function getMe(req, res) {
	const userId = req.user._id;

	const user = await User.findById(userId).select("-password -__v");

	return res.status(200).send({ user });
}

async function profile(req, res) {
	const userId = req.user._id;

	const user = await User.findById(userId).select("-password -__v");

	return res.status(200).send({ user });
}

module.exports = {
	register,
	getOne,
	getMe,
	profile,
};
