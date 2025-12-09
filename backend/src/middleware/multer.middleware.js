import multer from "multer";
import path from "path";
// creating storage and filestorage name format of date and file original name
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});
// filter file type jpeg,jpg,png,webp only
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLocaleLowerCase());
    const mimeType = allowedTypes.test(file.mimeType);

    if(extname && mimeType){
        cb(null, true)
    }else {
        cb(new Error("Only image files are allowed (jpeg,jpg,png,webp)"))
    }
}
// Upload file
export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5*1024*1024 } // 5MB limit
});