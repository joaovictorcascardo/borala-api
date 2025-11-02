import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const uploadFolder = path.resolve(__dirname,'files');
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
};