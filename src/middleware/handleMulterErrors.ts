import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

const handleMulterErrors = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Error en la carga de archivos', error: err.message });
    } else if (err) {
        return res.status(500).json({ message: 'Error inesperado en la carga de archivos', error: err.message });
    }
    next();
};

export default handleMulterErrors;
