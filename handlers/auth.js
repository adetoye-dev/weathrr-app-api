import { db } from "../connection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

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

    const uuid = uuidv4();
    const userId = `native_${uuid}`; // create signed user id

    const q =
      "INSERT INTO `users` (username, email, password, name, userId) VALUES (?)";
    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
      userId,
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

    const refreshToken = jwt.sign({ id: data[0].userId }, "refresh_key", {
      expiresIn: "1w",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
      sameSite: process.env.ENVIRONMENT === "development" ? true : "none",
      secure: process.env.ENVIRONMENT === "development" ? false : true,
    });

    const token = jwt.sign({ id: data[0].userId }, "secretkey", {
      expiresIn: "60s",
    });
    res.status(200).send({
      token,
      user: others,
    });
  });
};

export const validateAuth = async (req, res) => {
  console.log("called validate Auth");
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successful",
      user: req.user,
    });
  } else {
    try {
      const accessToken = req.header("Authorization")?.split(" ")[1] || "";

      const payload = jwt.verify(accessToken, "secretkey");

      if (!payload) return res.status(401).json("unauthenticated");

      jwt.verify(accessToken, "secretkey", (err, data) => {
        if (err) return res.status(403).json("Invalid Token");
        const q = "SELECT * FROM `users` where id = ?";
        db.query(q, [data.id], (err, data) => {
          if (err) return res.status(500).json(err);
          if (data.length === 0) return res.status(404).json("User not found");

          //SEND BACK VALID USER
          const { password, ...others } = data[0];
          res.status(200).json({
            success: true,
            message: "successful",
            user: others,
            //   cookies: req.cookies
          });
        });
      });
    } catch (err) {
      return res.status(401).send({
        message: "unauthenticated",
      });
    }
  }
};

export const tokenRefresh = async (req, res) => {
  console.log("tokenRefresh was called");
  try {
    const refreshToken = req.cookies["refreshToken"];
    const payload = jwt.verify(refreshToken, "refresh_key");

    if (!payload) {
      return res.status(401).send({
        message: "unauthenticated",
      });
    }

    const token = jwt.sign(
      {
        id: payload.id,
      },
      "secretkey",
      { expiresIn: "60s" }
    );

    res.status(200).send({
      token,
    });
  } catch (e) {
    return res.status(401).send({
      message: "unauthenticated",
    });
  }
};

export const logout = (req, res) => {
  res
    .cookie("refreshToken", "", { maxAge: 0 })
    .status(200)
    .redirect(process.env.CLIENT_URL + "/login");
};
