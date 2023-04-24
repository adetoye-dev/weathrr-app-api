import { db } from "../connection.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const userChannel = userId.split("_")[0];

  let table = "";
  if (userChannel === "google") {
    console.log("google table ran");
    table = "google_users";
  } else {
    console.log("native table ran");
    table = "users";
  }

  const q = `SELECT name , profilePic, city, about, userId FROM ${table}  
  WHERE (userId = ?)`;

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data[0]);
  });
};

export const updateUser = (req, res) => {
  const token = req.header("Authorization")?.split(" ")[1] || "";
  if (!token && !req.user) return res.status(401).json("User not logged in");

  if (req.user) {
    const q =
      "UPDATE `google_users` SET `name` = ?, `profilePic` = ?, `picId` = ?, `city` = ?, `about` = ? WHERE (id = ?)";
    const values = [
      req.body.name,
      req.body.img.url,
      req.body.img.id,
      req.body.city,
      req.body.about,
      req.user.id,
    ];
    db.query(q, [...values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Profile Updated Successfully!!");
    });
  } else {
    jwt.verify(token, "secretkey", (err, data) => {
      if (err) return res.status(403).json("Invalid Token");

      const q =
        "UPDATE `users` SET `name` = ?, `profilePic` = ?, `picId` = ?, `city` = ?, `about` = ? WHERE (id = ?)";
      const values = [
        req.body.name,
        req.body.img.url,
        req.body.img.id,
        req.body.city,
        req.body.about,
        data.id,
      ];
      db.query(q, [...values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Profile Updated Successfully!!");
      });
    });
  }
};
