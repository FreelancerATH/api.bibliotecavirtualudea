import multer from "multer"
import path from "path"
import fs from "fs"
import crypto from "crypto"
import type { Request } from "express"

// Configuración para almacenar la portada (imagen)
const portadaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "portadas")

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
  const allowedMimes = ["image/jpeg", "image/png", "image/jpg"]
  const allowedExts = [".jpg", ".jpeg", ".png"]
  const extname = path.extname(file.originalname).toLowerCase()

  if (allowedMimes.includes(file.mimetype) && allowedExts.includes(extname)) {
    return cb(null, true)
  }

  cb(new Error("Formato de imagen no válido. Solo se permiten archivos JPG, JPEG o PNG"))
}

// Configuración para la carga de la portada
const uploadPortada = multer({
  storage: portadaStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5, // Solo un archivo
  },
})

export default uploadPortada

