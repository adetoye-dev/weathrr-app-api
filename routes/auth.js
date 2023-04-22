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
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: process.env.CLIENT_URL + "/login",
  })
);
router.get("/google/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL + "/login");
});

export default router;
