import multer from "multer"
import path from "path"

export const storage = (destination: string) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `./storage/${destination}/`);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
}