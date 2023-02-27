import express from "express";
import { getUsers } from "../handlers/users.js";

const router = express.Router();

router.get("/", getUsers);

export default router;
