import multer from 'multer';
import fs from 'fs';

const mapUploadDest = `${process.env.MAP_UPLOAD_DIR}`;
const mapStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { id, name } = req.body;
        if (!name || name.length === 0) {
            cb();
        }
        const mapDir = Buffer.from(id).toString('base64');
        const dir = `${mapUploadDest}/${mapDir}`;
        try {
            // Ensure the map directory are 777
            fs.mkdirSync(mapUploadDest, { recursive: true });
            fs.chmodSync(mapUploadDest, 0o777);
            fs.mkdirSync(dir, { recursive: true });
            fs.chmodSync(dir, 0o777);
        } catch (err) {
            cb(err);
        }
        return cb(null, dir);
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        if (!originalname || originalname.length === 0) {
            cb();
        }
        const filename = Buffer.from(originalname).toString('base64');
        cb(null, filename);
    }
});
const mapUpload = multer({ storage: mapStorage });

const logoUploadDest = process.env.LOGO_UPLOAD_DIR;
const logoStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, logoUploadDest),
    filename: (req, file, cb) => {
        const extension = file.mimetype.replace('image/', '');
        const fileName = Buffer.from(`cadvanced__${req.body.departmentId}`);
        cb(null, `${fileName}.${extension}`);
    }
});
const logoUpload = multer({ storage: logoStorage });

export { mapUpload, logoUpload };
