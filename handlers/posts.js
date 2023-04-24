import { db } from "../connection.js";
import jwt from "jsonwebtoken";
import moment from "moment/moment.js";
import dotenv from "dotenv";

dotenv.config();

export const fetchPostCreator = (req, res) => {
  const creatorId = req.body.creatorId;
  const userChannel = creatorId.split("_")[0];

  let table = "";
  if (userChannel === "google") {
    table = "google_users";
  } else {
    table = "users";
  }

  const q = `SELECT name , profilePic FROM ${table} WHERE (userId = ?)`;

  db.query(q, [creatorId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data[0]);
  });
};

//show All Posts from all Users
export const getPosts = (req, res) => {
  const token = req.header("Authorization")?.split(" ")[1] || "";
  if (!token && !req.user) return res.status(401).json("User not logged in");

  const q = `SELECT * FROM posts ORDER BY createdAt DESC`;

  if (req.user) {
    db.query(q, [req.user.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  } else {
    jwt.verify(token, "secretkey", (err, data) => {
      if (err) return res.status(403).json("Invalid Token");
      db.query(q, [data.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      });
    });
  }
};

//Get posts recommended based on your weather and country
export const getRecommendedPosts = (req, res) => {
  const q = `SELECT * FROM posts WHERE (weather = ? AND city = ? AND country = ?) ORDER BY createdAt DESC`;

  db.query(
    q,
    [req.body.weather, req.body.location, req.body.country],
    (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    }
  );
};

//Get posts recommended based on your weather and country
export const getNearbyPosts = (req, res) => {
  const q = `SELECT * FROM posts WHERE (country = ?) ORDER BY createdAt DESC`;

  db.query(q, [req.body.country], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

//Get posts from a specific user
export const getUserPosts = (req, res) => {
  const userId = req.params.userId;

  const q = `SELECT * FROM posts WHERE (creatorId = ?)`;
  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

//Get posts only from users you're following
export const getFollowedUsersPosts = (req, res) => {
  const token = req.header("Authorization")?.split(" ")[1] || "";
  if (!token && !req.user) return res.status(401).json("User not logged in");

  const q = `SELECT p.* FROM posts AS p 
      JOIN relationships AS r ON (p.creatorId = r.followedUserId) WHERE r.followerUserId = ?`;

  if (req.user) {
    db.query(q, [req.user.userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  } else {
    jwt.verify(token, "secretkey", (err, data) => {
      if (err) return res.status(403).json("Invalid Token");

      db.query(q, [data.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      });
    });
  }
};

//Add new post to db
export const addPost = (req, res) => {
  const token = req.header("Authorization")?.split(" ")[1] || "";
  if (!token && !req.user) return res.status(401).json("User not logged in");

  const q =
    "INSERT INTO posts (`desc`, `imgId`, `imgUrl`, `creatorId`, `city`, `country`,  `weather`, `createdAt`) VALUES (?)";

  if (req.user) {
    const values = [
      req.body.desc,
      req.body.img.id,
      req.body.img.url,
      req.user.userId,
      req.body.city,
      req.body.country,
      req.body.weather,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post Created Successfully!!");
    });
  } else {
    jwt.verify(token, "secretkey", (err, data) => {
      if (err) return res.status(403).json("Invalid Token");
      const values = [
        req.body.desc,
        req.body.img.id,
        req.body.img.url,
        data.id,
        req.body.city,
        req.body.country,
        req.body.weather,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      ];
      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Post Created Successfully!!");
      });
    });
  }
};
