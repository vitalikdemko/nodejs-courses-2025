import multer from 'multer';
import path   from 'node:path';
import crypto from 'node:crypto';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => {
    const ext   = path.extname(file.originalname);       
    const safe  = path.basename(file.originalname, ext) 
      .replace(/[^a-z0-9_\-]/gi, '_')   
      .slice(0, 50);
    const stamp = Date.now();
    const rand  = crypto.randomBytes(4).toString('hex');
    cb(null, `${stamp}-${rand}-${safe}${ext}`); 
  }
});

export const upload = multer({ storage });