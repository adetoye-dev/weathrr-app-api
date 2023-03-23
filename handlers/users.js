import { db } from "../connection.js";

export const getUsers = (req, res) => {
  res.send("Hello from server router");
};

export const getUser = (req, res) => {
  const userId = req.params.userId;

  const q = `SELECT id , name , profilePic, city, about FROM users  
      WHERE (id = ?)`;
  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
