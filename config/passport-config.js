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
    }
  )
);
