import dotenv from "dotenv";
import * as cloudinary from "cloudinary";

dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadPostImage = async (req, res) => {
  const file = req.body.img;

  // Upload
  const data = await cloudinary.v2.uploader
    .upload(file, {
      folder: "weatherPosts",
    })
    .then((data) => data)
    .catch((err) => {
      res.status(500).send(err);
    });

  res.status(200).json({ id: data.public_id, url: data.url });
};

export async function uploadProfileImage(req, res) {
  const file = req.body.img;

  // Upload
  const data = await cloudinary.v2.uploader
    .upload(file, {
      folder: "weatherUsers",
    })
    .then((data) => data)
    .catch((err) => {
      res.status(500).send(err);
    });

  res.status(200).json({ id: data.public_id, url: data.secure_url });
}
