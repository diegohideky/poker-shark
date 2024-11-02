import multer from "multer";
import multerS3 from "multer-s3";
import s3 from "@libs/s3";

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: "public-read",
    key: (req, file, cb) => {
      const fileName = file.originalname;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    // Restrict file types to images
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"), false);
    } else {
      cb(null, true);
    }
  },
});

export const uploadSingle = upload.single("photo");
