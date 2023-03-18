import express from "express";
import {
  getFavorites,
  getSavedPosts,
  addFavorite,
  deleteFavorite,
} from "../handlers/bookmarks.js";

const router = express.Router();

router.get("/", getFavorites);
router.get("/user", getSavedPosts);
router.post("/", addFavorite);
router.delete("/", deleteFavorite);

export default router;
