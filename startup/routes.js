const express = require("express");
const logger = require("../middleware/logger.middleware");
const generatorRouter = require("../routers/generator.route");
const userRouter = require("../routers/user.route");
const authRouter = require("../routers/auth.route");
const qrCodesRouter = require("../routers/qrCodes.route");
const publicRouter = require("../routers/public.route");

module.exports = function (app) {
	app.use(express.json());

	/* Routers */
	app.use("/api/generate", generatorRouter);
	app.use("/api/user", userRouter);
	app.use("/api/auth", authRouter);
	app.use("/api/qr-codes", qrCodesRouter);
	app.use("/api/public/qr-codes", publicRouter);

	app.get("/", (req, res) => {
		return res.status(200).json({ message: "service is active" });
	});

	// Define all your routes above this middleware
	app.use((req, res, next) => {
		return res.status(404).json({
			message: "404 Resource not found",
		});
	});
	// Error logger
	app.use(logger);
};
