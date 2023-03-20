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

export const addRelationship = (req, res) => {};

export const deleteRelationship = (req, res) => {};
