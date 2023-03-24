import { db } from "../connection.js";
import jwt from "jsonwebtoken";
import moment from "moment/moment.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

//show All Posts from all Users
export const getPosts = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("User not logged in");

  jwt.verify(token, "secretkey", (err, data) => {
    if (err) return res.status(403).json("Invalid Token");
    const q = `SELECT p.*, u.id AS userId, name AS userName, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) ORDER BY p.createdAt DESC`;
    db.query(q, [data.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

//Get posts recommended based on your weather and country
export const getRecommendedPosts = (req, res) => {
  const q = `SELECT p.*, u.id AS userId, name AS userName, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE (p.weather = ? AND p.city = ? AND p.country = ?) ORDER BY p.createdAt DESC`;

  db.query(
    q,
    [req.body.weather, req.body.location, req.body.country],
    (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    }
  );
};

//Get posts from a specific user
export const getUserPosts = (req, res) => {
  const userId = req.params.userId;

  const q = `SELECT p.*, u.id AS userId, name AS userName, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) 
      WHERE (p.userId = ?)`;
  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

//Get posts only from users you're following
export const getFollowedUsersPosts = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("User not logged in");

  jwt.verify(token, "secretkey", (err, data) => {
    if (err) return res.status(403).json("Invalid Token");
    const q = `SELECT p.*, u.id AS userId, name AS userName, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) 
      JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ?`;
    db.query(q, [data.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

//Add new post to db
export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("User not logged in");

  jwt.verify(token, "secretkey", (err, data) => {
    if (err) return res.status(403).json("Invalid Token");
    console.log({ ...req.body }, req.files.img);
    savePost();

    async function savePost() {
      await axios
        .post(
          "https://www.filestackapi.com/api/store/S3?key=" +
            process.env.FILESTACK_API_KEY,
          req.files.img.data,
          {
            headers: {
              "Content-Type": "image/png",
            },
          }
        )
        .then((res) => res.data)
        .then((img) => {
          const q =
            "INSERT INTO posts (`desc`, `img`, `userId`, `city`, `temp`, `createdAt`) VALUES (?)";
          const values = [
            req.body.desc,
            img.url,
            data.id,
            req.body.city,
            req.body.temp,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
          ];
          db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Post Created Successfully!!");
          });
        });
    }
  });
};
