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
      console.log(profile);

      //CHECK IF USER ALREADY EXISTS
      const q = "SELECT * FROM `google_users` where googleId = ?";
      db.query(q, [profile.id], (err, data) => {
        // if (err) return res.status(500).json(err);
        if (err) return console.log(err);
        if (data.length) return console.log("User already exists!");

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
          console.log("Created new user:", values);
        });
      });
    }
  )
);
