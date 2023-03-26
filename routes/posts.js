import express from "express";
import {
  getPosts,
  getUserPosts,
  getFollowedUsersPosts,
  addPost,
  getRecommendedPosts,
  getNearbyPosts,
} from "../handlers/posts.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/following", getFollowedUsersPosts);
router.get("/:userId", getUserPosts);
router.post("/addPost", addPost);
router.post("/recommend", getRecommendedPosts);
router.post("/region", getNearbyPosts);

export default router;
