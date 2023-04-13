import { db } from "../connection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const register = (req, res) => {
  //CHECK IF USER ALREADY EXISTS
  const q = "SELECT * FROM `users` where username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("Username already taken!");

    //CREATE NEW USER
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    const q = "INSERT INTO `users` (username, email, password, name) VALUE (?)";
    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
    ];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("SignUp Was Successful! Proceed to login!");
    });
  });
};

export const login = (req, res) => {
  //CHECK IF USER EXISTS
  const q = "SELECT * FROM `users` where username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found");

    //CHECK IF PASSWORD IS VALID
    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );
    if (!checkPassword) {
      return res.status(400).json("Invalid username or password");
    }
    //LOGIN
    const { password, ...others } = data[0];

    const token = jwt.sign({ id: data[0].id }, "secretkey");
    res
      .cookie("accessToken", token, {
        httpOnly: true,
        sameSite: process.env.ENVIRONMENT === "development" ? true : "none",
        secure: process.env.ENVIRONMENT === "development" ? false : true,
      })
      .status(200)
      .json(others);
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has been logged out");
};
