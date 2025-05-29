import multer from "multer"
import path from "path"
import fs from "fs"
import crypto from "crypto"
import type { Request } from "express"

// Configuración para almacenar el archivo del libro
const libroStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "libros")

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }

    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    // Generar nombre de archivo seguro y único
    const randomName = crypto.randomBytes(16).toString("hex")
    const extname = path.extname(file.originalname).toLowerCase()
    cb(null, `${Date.now()}-${randomName}${extname}`)
  },
})

// Validación de tipos de archivo
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
  const allowedExts = [".pdf", ".docx"]
  const extname = path.extname(file.originalname).toLowerCase()

  if (allowedMimes.includes(file.mimetype) && allowedExts.includes(extname)) {
    return cb(null, true)
  }

  cb(new Error("Formato de archivo no válido. Solo se permiten archivos PDF o DOCX"))
}

// Configuración para la carga del archivo del libro
const uploadLibro = multer({
  storage: libroStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1, // Solo un archivo
  },
})

export default uploadLibro

