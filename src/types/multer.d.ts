import { Request } from 'express';

// Extiende el tipo Request de Express para incluir la propiedad `files`
declare global {
  namespace Express {
    interface Request {
      files: {
        archivo?: Express.Multer.File[];  // Para los archivos del libro
        portada?: Express.Multer.File[];  // Para las portadas
      };
    }
  }
}
