import { Request } from "express";
import multer from "multer";

const storage = multer.diskStorage({
  filename: function (req: Request, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

export default upload;
