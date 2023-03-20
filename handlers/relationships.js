import { db } from "../connection.js";
import jwt from "jsonwebtoken";

export const getRelationships = (req, res) => {
  const userId = req.query.userId;

  const q = `SELECT followerUserId FROM relationships WHERE followedUserId = ?`;
  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((item) => item.followerUserId));
  });
};

export const getUserFollowings = (req, res) => {
  const userId = req.query.userId;

  const q = `SELECT followedUserId FROM relationships WHERE followerUserId = ?`;
  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((item) => item.followedUserId));
  });
};

export const addRelationship = (req, res) => {
  const userId = req.body.userId;

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("User not logged in");

  jwt.verify(token, "secretkey", (err, data) => {
    if (err) return res.status(403).json("Invalid Token");
    const q =
      "INSERT INTO relationships (`followerUserId`, `followedUserId`) VALUES (?)";
    const values = [data.id, userId];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post added to bookmarks");
    });
  });
};

export const deleteRelationship = (req, res) => {
  const userId = req.query.userId;

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("User not logged in");

  jwt.verify(token, "secretkey", (err, data) => {
    if (err) return res.status(403).json("Invalid Token");
    const q =
      "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";

    db.query(q, [data.id, userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post removed from bookmarks");
    });
  });
};
