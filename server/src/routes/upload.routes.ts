import { Router } from "express";
import multer from "multer";
import { requireAdmin } from "../middleware/adminAuth";
import { uploadFilesHandler } from "../controllers/upload.controller";

const router = Router();

// In-memory storage; each file is streamed directly to Cloudinary in the controller.
const storage = multer.memoryStorage();

// Typed filter
const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const isOk = /^image\/|^video\//.test(file.mimetype);
  if (isOk) cb(null, true);
  else cb(new Error("Unsupported file type"));
};

const upload = multer({
  storage,
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE_MB || 15) * 1024 * 1024,
    files: 10,
  },
  fileFilter,
});

// POST /api/uploads  (auth-protected)
// field name: "files"
router.post("/", requireAdmin as any, upload.array("files", 10), uploadFilesHandler);

export default router;
