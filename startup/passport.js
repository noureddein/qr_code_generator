const { Strategy, ExtractJwt } = require("passport-jwt");
const passport = require("passport");
const config = require("config");

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: config.get("access_secret_key"),
};

passport.use(
	new Strategy(opts, (jwt_payload, done) => {
		try {
			const currentTime = Math.floor(Date.now() / 1000);

			if (jwt_payload.exp < currentTime) {
				return done(null, false, { message: "Token has expired" });
			}

			return done(null, jwt_payload);
		} catch (error) {
			console.error("Error in JWT Strategy:", error);
			return done(error, false);
		}
	})
);
