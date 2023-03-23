import { db } from "../connection.js";
import jwt from "jsonwebtoken";
import axios from "axios";

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
    saveUserData();

    async function saveUserData() {
      await axios
        .post(
          "https://www.filestackapi.com/api/store/S3?key=" +
            process.env.FILESTACK_API_KEY,
          req.files.profilePic.data,
          {
            headers: {
              "Content-Type": "image/png",
            },
          }
        )
        .then((res) => res.data)
        .then((img) => {
          const q =
            "UPDATE users SET `name` = ?, `profilePic` = ?, `city` = ?, `about` = ? WHERE (id = ?)";
          const values = [
            req.body.name,
            img.url,
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
  });
};
