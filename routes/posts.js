import express from "express";
import {
  getPosts,
  getUserPosts,
  getFollowedUsersPosts,
  addPost,
  getRecommendedPosts,
} from "../handlers/posts.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/following", getFollowedUsersPosts);
router.get("/:userId", getUserPosts);
router.post("/addPost", addPost);
router.post("/recommend", getRecommendedPosts);

export default router;
