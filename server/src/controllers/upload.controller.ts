import type { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary from env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const FOLDER = process.env.CLOUDINARY_FOLDER || "indeed-immo";

/**
 * POST /api/uploads
 * Expects multipart form-data with field name "files"
 * Returns: { urls: string[] }
 */
export async function uploadFilesHandler(req: Request, res: Response) {
  const files = (req.files as Express.Multer.File[]) || [];
  if (!files.length) return res.status(400).json({ message: "No files uploaded" });

  try {
    const urls = await Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const resource_type = file.mimetype.startsWith("video/") ? "video" : "image";

            const stream = cloudinary.uploader.upload_stream(
              { folder: FOLDER, resource_type },
              (err, result) => {
                if (err || !result) return reject(err || new Error("Upload failed"));
                resolve(result.secure_url);
              }
            );

            stream.end(file.buffer);
          })
      )
    );

    res.json({ urls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
}
