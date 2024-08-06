import { Request, Response, Router } from "express";
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary";

import upload from "../middleware/multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

export const cloudinaryConfig = cloudinary;

export default (router: Router): void => {
  router.post(
    "/upload",
    upload.single("image"),
    async (req: Request, res: Response): Promise<void> => {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
        return;
      }

      cloudinaryConfig.uploader.upload(
        req.file.path,
        (
          err: UploadApiErrorResponse | null,
          result: UploadApiResponse | undefined
        ): void => {
          if (err) {
            console.error(err);
            res.status(500).json({
              success: false,
              message: "Error",
            });
            return;
          }

          res.status(200).json({
            success: true,
            message: "Uploaded!",
            data: result,
          });
        }
      );
    }
  );
};
