import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid';
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${nanoid(10)}${ext}`);
  },
});

const ACCEPTED_MIME = ['image/png', 'image/jpeg'];

export const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024, files: 5 }, // 8MB per file, 5 files max
  fileFilter: (req, file, cb) => {
    if (!ACCEPTED_MIME.includes(file.mimetype)) {
      return cb(new Error('Only PNG or JPG images are allowed'));
    }
    cb(null, true);
  },
});
