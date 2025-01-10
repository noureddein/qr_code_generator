const express = require("express");
const logger = require("../middleware/logger.middleware");
const generatorRouter = require("../routers/generator.route");
const userRouter = require("../routers/user.route");
const authRouter = require("../routers/auth.route");
const qrCodesRouter = require("../routers/qrCodes.route");

module.exports = function (app) {
	app.use(express.json());

	/* Routers */
	app.use("/api/generate", generatorRouter);
	app.use("/api/user", userRouter);
	app.use("/api/auth", authRouter);
	app.use("/api/qr-codes", qrCodesRouter);

	// Error logger
	app.use(logger);
};
