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

  const token = req.header("Authorization")?.split(" ")[1] || "";
  if (!token && !req.user) return res.status(401).json("User not logged in");

  const q =
    "INSERT INTO relationships (`followerUserId`, `followedUserId`) VALUES (?)";

  if (req.user) {
    const values = [req.user.id, userId];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("You followed this user");
    });
  } else {
    jwt.verify(token, "secretkey", (err, data) => {
      if (err) return res.status(403).json("Invalid Token");

      const values = [data.id, userId];

      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("You followed this user");
      });
    });
  }
};

export const deleteRelationship = (req, res) => {
  const userId = req.query.userId;

  const token = req.header("Authorization")?.split(" ")[1] || "";
  if (!token && !req.user) return res.status(401).json("User not logged in");

  const q =
    "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";

  if (req.user) {
    db.query(q, [req.user.id, userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("You unfollowed this user");
    });
  } else {
    jwt.verify(token, "secretkey", (err, data) => {
      if (err) return res.status(403).json("Invalid Token");

      db.query(q, [data.id, userId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("You unfollowed this user");
      });
    });
  }
};
