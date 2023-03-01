import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
