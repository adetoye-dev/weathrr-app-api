import express from "express";
import { register, login, logout } from "../handlers/auth.js";
import passport from "passport";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/google", passport.authenticate("google"));
router.get(
  "/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    res.send("Hello, you made it to the callback");
  }
  // passport.authenticate("google", {
  //   successReturnToOrRedirect: "http://localhost:3000/hello",
  //   failureRedirect: "http://localhost:3000/",
  // })
);

export default router;
