import gStrategy from "passport-google-oauth20";
const GoogleStrategy = gStrategy.Strategy;
import passport from "passport";
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.CLIENT_ID_GG,
			clientSecret: process.env.CLIENT_SECRET_GG,
			callbackURL: "/auth/google/callback",
			scope: ["profile", "email"],
		},
		function (accessToken, refreshToken, profile, callback) {
			callback(null, profile);
		}
	)
);
passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});
export default passport;
