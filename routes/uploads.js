import express from "express";
import { uploadPostImage, uploadProfileImage } from "../handlers/uploads.js";

const router = express.Router();

router.post("/post-img", uploadPostImage);
router.post("/profile-img", uploadProfileImage);

export default router;
