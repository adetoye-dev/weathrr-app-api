import passport from "passport";
import * as googleAuth from "passport-google-oauth20";
const GoogleStrategy = googleAuth.Strategy;
import { db } from "../connection.js";

// Configure the Google strategy for use by Passport.
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      scope: ["email", "profile"],
    },
    (request, accessToken, refreshToken, profile, done) => {
      //CHECK IF USER ALREADY EXISTS
      const q = "SELECT * FROM `google_users` where googleId = ?";
      db.query(q, [profile.id], (err, data) => {
        // if (err) return res.status(500).json(err);
        if (err) return done(err, null);
        if (data.length) {
          const { ...user } = data[0];
          return done(null, user);
        }

        //CREATE NEW USER
        const userId = `${profile.provider}_${profile.id}`; //create signed user id
        const q =
          "INSERT INTO `google_users` (googleId, name, email, profilePic, userId) VALUES (?)";
        const values = [
          profile.id,
          profile.displayName,
          profile._json.email,
          profile._json.picture,
          userId,
        ];
        db.query(q, [values], (err, data) => {
          if (err) return done(err, null);
          const q = "SELECT * FROM `google_users` where googleId = ?";
          db.query(q, [profile.id], (err, data) => {
            if (err) return done(err, null);
            // return res.status(200).json(data);
            const { ...user } = data[0];
            return done(null, user);
          });
        });
      });
    }
  )
);

// Configure Passport authenticated session persistence.
passport.serializeUser((user, done) => {
  return done(null, user.userId);
});

passport.deserializeUser((id, done) => {
  const q = "SELECT * FROM `google_users` where userId = ?";
  db.query(q, [id], (err, data) => {
    if (err) return done(err, null);
    // return res.status(200).json(data);
    const { ...user } = data[0];
    return done(null, user);
  });
});
