import express from "express";
import {
  getRelationships,
  getUserFollowings,
  addRelationship,
  deleteRelationship,
} from "../handlers/relationships.js";

const router = express.Router();

router.get("/", getRelationships);
router.get("/following", getUserFollowings);
router.post("/", addRelationship);
router.delete("/", deleteRelationship);

export default router;
