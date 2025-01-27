const { User } = require("../models/user.model");
const bcrypt = require("bcrypt");
const config = require("config");
const { REFRESH_TOKEN_EXPIRY_IN_MILLISECOND } = require("../constants/index");
const _pick = require("lodash/pick");
const jwt = require("jsonwebtoken");

const refresh_secret_key = config.get("refresh_secret_key");

async function login(req, res) {
	// TODO: Let user login with email or username
	const { email, password } = req.body;

	const user = await User.findOne({ email }).select("-__v");

	const isPasswordsMatch = bcrypt.compareSync(password, user.password);

	if (!isPasswordsMatch) {
		return res.status(409).send({ message: "Invalid credentials." });
	}

	const accessToken = user.generateAccessToken();
	const refreshToken = user.generateRefreshToken();

	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		maxAge: REFRESH_TOKEN_EXPIRY_IN_MILLISECOND,
		// secure: process.env.NODE_ENV === "production",
		// sameSite: "strict",
		secure: true,
		sameSite: "None",
	});

	return res.status(200).send({
		message: "Login successful.",
		user: _pick(user, [
			"_id",
			"firstName",
			"lastName",
			"email",
			"username",
		]),
		accessToken,
	});
}

async function identity(req, res) {
	const user = await User.findById(req.user._id);

	return res.status(200).send({
		isLoggedIn: true,
		user: _pick(user, [
			"_id",
			"firstName",
			"lastName",
			"email",
			"username",
		]),
	});
}

async function logout(req, res) {
	const { refreshToken } = req.cookies;

	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		maxAge: 0,
		secure: true,
		sameSite: "none",
	});

	return res.status(201).send();
}

async function refreshToken(req, res) {
	const { refreshToken } = req.cookies;
	const isValid = jwt.verify(refreshToken, refresh_secret_key);

	if (!isValid) {
		return res.status(403).json({ message: "Unauthorized" });
	}

	const decodedJwt = jwt.decode(refreshToken);

	const user = await User.findById(decodedJwt._id);

	if (!user) {
		return res.status(403).json({ message: "Unauthorized" });
	}

	const accessToken = user.generateAccessToken();

	return res.status(200).json({ message: "access token sent.", accessToken });
}

module.exports = {
	login,
	identity,
	logout,
	refreshToken,
};
