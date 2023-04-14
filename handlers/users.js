import { db } from "../connection.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const userId = req.params.userId;

  const q = `SELECT id , name , profilePic, city, about FROM users  
      WHERE (id = ?)`;
  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("User not logged in");

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
};
