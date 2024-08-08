import { Request, Response } from 'express';
import path from 'path';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

export const uploadFile = (file: string) => upload.single(file);
export const uploadFiles = upload.array('files', 10);
export const uploadFields = (fields: { name: string }[]) => {
    return multer({ storage }).fields(fields);
};
