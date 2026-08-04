import multer, {FileFilterCallback} from "multer";
import { Request } from "express";
import { MAX_FILE_SIZE,ALLOWED_MIME_TYPES } from "../utils/s3Upload.js";


const storage = multer.memoryStorage();


const fileFilter = (
_req: Request,
file: Express.Multer.File,
cb: FileFilterCallback
) => {
     console.log('[multer] incoming field:', file.fieldname);
  console.log('[multer] mimetype:', file.mimetype);  
    if(ALLOWED_MIME_TYPES.includes(file.mimetype as any)){
        cb(null, true)
    }else{
        cb(new Error(`Invalid file type: ${file.mimetype}.Allowed: PDF, JPG, PNG`));
    }
}

export const uploadMIddleware = multer({
    storage,
    limits: {fileSize: MAX_FILE_SIZE},
    fileFilter,
})

export const doctorDocumentUpload = uploadMIddleware.fields([
    { name: 'profileImage',            maxCount: 1 },
    {name:  'degreeCertificate', maxCount: 1},
    {name: 'registrationCertificate', maxCount: 1},
    {name: 'governmentId', maxCount: 1}
])


export const handleMulterError = (
    err: any,
    req: any,
    res: any,
    next: any
) => {
    if(err){
        console.log(`[multer] error:`,err.message, '| field:', err.field)
         if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: `Unexpected field: "${err.field}". Expected: degreeCertificate, registrationCertificate, governmentId`,
      });
    }
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large. Maximum size is 5MB.',
      });
    }
    return res.status(400).json({ error: err.message });
  }

  next();
}
