import { db } from "../connection.js";
import jwt from "jsonwebtoken";

export const getSavedPosts = (req, res) => {
  const token = req.header("Authorization")?.split(" ")[1] || "";
  if (!token) return res.status(401).json("User not logged in");

  jwt.verify(token, "secretkey", (err, data) => {
    if (err) return res.status(403).json("Invalid Token");
    const q = `SELECT p.*, u.id AS userId, name AS userName, profilePic, b.userId as bookmarkId FROM posts AS p JOIN users AS u JOIN bookmarks as b ON (u.id = p.userId) AND (b.postId = p.id) WHERE (b.userId = ?)`;
    db.query(q, [data.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const getFavorites = (req, res) => {
  const postId = req.query.postId;

  const q = `SELECT userId FROM bookmarks WHERE postId = ?`;
  db.query(q, [postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((item) => item.userId));
  });
};

export const addFavorite = (req, res) => {
  const postId = req.body.postId;

  const token = req.header("Authorization")?.split(" ")[1] || "";
  if (!token) return res.status(401).json("User not logged in");

  jwt.verify(token, "secretkey", (err, data) => {
    if (err) return res.status(403).json("Invalid Token");
    const q = "INSERT INTO bookmarks (`userId`, `postId`) VALUES (?)";
    const values = [data.id, postId];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post added to bookmarks");
    });
  });
};

export const deleteFavorite = (req, res) => {
  const postId = req.query.postId;

  const token = req.header("Authorization")?.split(" ")[1] || "";
  if (!token) return res.status(401).json("User not logged in");

  jwt.verify(token, "secretkey", (err, data) => {
    if (err) return res.status(403).json("Invalid Token");
    const q = "DELETE FROM bookmarks WHERE `userId` = ? AND `postId` = ?";

    db.query(q, [data.id, postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post removed from bookmarks");
    });
  });
};
