import express from "express";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import cors from "cors";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import bookmarkRoutes from "./routes/bookmarks.js";
import uploadRoutes from "./routes/uploads.js";
import relationshipRoutes from "./routes/relationships.js";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import passport from "passport";
import "./config/passport-config.js";
const app = express();

dotenv.config();

app.set("trust proxy", 1);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(fileUpload());

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());

// setup cookie session
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_KEY],

    // Cookie Options
    sameSite: "none",
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // One Week
  })
);

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/uploads", uploadRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
