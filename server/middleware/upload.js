import multer from 'multer';

const ACCEPTED_MIME = ['image/png', 'image/jpeg'];

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 5 },
  fileFilter: (req, file, cb) => {
    if (!ACCEPTED_MIME.includes(file.mimetype)) {
      return cb(new Error('Only PNG or JPG images are allowed'));
    }
    cb(null, true);
  },
});
