import dotenv from "dotenv";
import path from "path";
const __dirname = path.resolve();

dotenv.config();

export const uploadPostImage = (req, res) => {
  const filename = Date.now() + "_" + req.files.img.name;
  const file = req.files.img;
  const uploadPath = __dirname + "/uploads/postImages/" + filename;
  file.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).json(err);
    }
  });
  res.status(200).json(filename);
};

export const uploadProfileImage = (req, res) => {
  const filename = Date.now() + "_" + req.files.img.name;
  const file = req.files.img;
  const uploadPath = __dirname + "/uploads/profileImages/" + filename;
  file.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).json(err);
    }
  });
  res.status(200).json("File Uploaded Successfully!");
};
