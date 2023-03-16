import { db } from "../connection.js";
import jwt from "jsonwebtoken";
import moment from "moment/moment.js";

export const getPosts = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("User not logged in");

  jwt.verify(token, "secretkey", (err, data) => {
    if (err) return res.status(403).json("Invalid Token");
    const q = `SELECT p.*, u.id AS userId, name AS userName, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)`;
    db.query(q, [data.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const getSavedPosts = (req, res) => {
  const userId = req.params.userId;

  const q = `SELECT p.*, u.id AS userId, name AS userName, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) JOIN bookmarks AS b ON (p.id = b.postId) WHERE b.userId = ?`;
  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getUserPosts = (req, res) => {
  const userId = req.params.userId;

  const q = `SELECT p.*, u.id AS userId, name AS userName, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) 
      WHERE (p.userId = ?)`;
  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

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

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("User not logged in");

  jwt.verify(token, "secretkey", (err, data) => {
    if (err) return res.status(403).json("Invalid Token");
    const q =
      "INSERT INTO posts (`title`, `desc`, `img`, `userId`, `city`, `temp`, `createdAt`) VALUES (?)";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
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
};
