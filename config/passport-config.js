import passport from "passport";
import * as googleAuth from "passport-google-oauth2";
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
      console.log("Yay! You made it to the callbacks.");

      //CHECK IF USER ALREADY EXISTS
      const q = "SELECT * FROM `google_users` where googleId = ?";
      db.query(q, [profile.id], (err, data) => {
        // if (err) return res.status(500).json(err);
        if (err) return console.log(err);
        if (data.length) {
          const { ...user } = data[0];
          console.log("User already exists:", user);
          return done(null, user);
        }

        console.log("This is a new user");
        //CREATE NEW USER
        const q =
          "INSERT INTO `google_users` (googleId, name, email, profilePic, channel) VALUES (?)";
        const values = [
          profile.id,
          profile.displayName,
          profile.email,
          profile.picture,
          profile.provider,
        ];
        db.query(q, [values], (err, data) => {
          if (err) return res.status(500).json(err);
          const q = "SELECT * FROM `google_users` where googleId = ?";
          db.query(q, [profile.id], (err, data) => {
            if (err) return res.status(500).json(err);
            // return res.status(200).json(data);
            const { ...user } = data[0];
            console.log("Created new user: ", user);
            return done(null, data);
          });
        });
      });
    }
  )
);

// Configure Passport authenticated session persistence.
passport.serializeUser(function (user, done) {
  process.nextTick(function () {
    done(null, {
      id: user.id,
      googleId: user.googleId,
      name: user.name,
      profilePic: user.profilePic,
      city: user.city,
      about: user.about,
      channel: user.channel,
    });
  });
});

passport.deserializeUser(function (user, done) {
  process.nextTick(function () {
    return done(null, user);
  });
});
