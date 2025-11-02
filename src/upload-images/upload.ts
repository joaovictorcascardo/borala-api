import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { Request } from 'express';

const uploadFolder = path.resolve(__dirname,'files');
const allowedFormats = ['image/jpeg', 'image/png'];
export default {
  directory: uploadFolder,
  storage: multer.diskStorage({
    destination: uploadFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(16).toString('hex');
      const fileExtension = path.extname(file.originalname);
      const fileName = fileHash + fileExtension;

      callback(null, fileName);
    },
  }),
  fileFilter: (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
    if (allowedFormats.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Arquivo inválido. Apenas JPEG e PNG são permitidos."));
    }
  },
};