import multer from "multer";
import fs from "fs";

// Crear carpeta si no existe
const ensureFolderExists = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Configurar almacenamiento según el campo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = file.fieldname === "portada" ? "uploads/portadas/" : "uploads/libros/";
    ensureFolderExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Filtro de archivos
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedImages = ["image/jpeg", "image/png"];
  const allowedBooks = ["application/pdf"];

  if (file.fieldname === "portada" && allowedImages.includes(file.mimetype)) {
    cb(null, true);
  } else if (file.fieldname === "archivo" && allowedBooks.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de archivo no permitido"), false);
  }
};

// Instancia de Multer
const upload = multer({ storage, fileFilter });

export default upload;
