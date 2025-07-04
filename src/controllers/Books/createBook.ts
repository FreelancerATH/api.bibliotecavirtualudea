import path from 'path';
import fs from 'fs/promises';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import cloudinaryModule from 'cloudinary';
import { uploadToDropbox } from '../../utils/dropboxUploader';
import Libro from '../../data/mysql/models/Libro'; // Asegúrate de importar tu modelo correctamente
import Area from '../../data/mysql/models/Area';
import Semestre from '../../data/mysql/models/Semestre';
import Materia from '../../data/mysql/models/Materia';

const cloudinary = cloudinaryModule.v2;

// Configuración de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
    secure: true
});

async function uploadToCloudinary(file: Express.Multer.File): Promise<string> {
    const result = await cloudinary.uploader.upload(file.path, {
        folder: 'portadas',
        use_filename: true,
        unique_filename: false
    });
    return result.secure_url;
}


export const createBook = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        const { nombreLibro, descripcion, autor, fkIdArea, fkIdSemestre, fkIdMateria } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        // Convertir valores a enteros
        const areaId = parseInt(fkIdArea, 10);
        const semestreId = parseInt(fkIdSemestre, 10);
        const materiaId = parseInt(fkIdMateria, 10);

        if (isNaN(areaId) || isNaN(semestreId) || isNaN(materiaId)) {
            return res.status(400).json({ message: "IDs inválidos, deben ser números enteros." });
        }

        // Verificar existencia de claves foráneas
        const area = await Area.findByPk(areaId);
        const semestre = await Semestre.findByPk(semestreId);
        const materia = await Materia.findByPk(materiaId);

        if (!area) return res.status(400).json({ message: `El área con ID ${areaId} no existe` });
        if (!semestre) return res.status(400).json({ message: `El semestre con ID ${semestreId} no existe` });
        if (!materia) return res.status(400).json({ message: `La materia con ID ${materiaId} no existe` });

        let archivoUrl = '';
        let portadaUrl = '';

        if (!files?.archivo?.[0] || !files?.portada?.[0]) {
            return res.status(400).json({ message: 'Se deben subir los archivos de libro y portada.' });
        }

        const archivo = files.archivo[0]
        const portada = files.portada[0]

        const docExt = path.extname(archivo.originalname).toLowerCase();
        if (!['.pdf', '.docx'].includes(docExt)) {
            await fs.unlink(archivo.path);
            return res.status(400).json({ message: 'El archivo debe ser .pdf o .docx' });
        }

        console.log('Subiendo archivo a Dropbox...');
        archivoUrl = await uploadToDropbox(archivo.path, archivo.originalname);
        const imageExt = path.extname(portada.originalname).toLowerCase();
        if (!['.jpg', '.jpeg', '.png'].includes(imageExt)) {
            await fs.unlink(portada.path);
            return res.status(400).json({ message: 'La portada debe ser .jpg, .jpeg o .png' });
        }

        console.log('Subiendo portada a Cloudinary...');
        portadaUrl = await uploadToCloudinary(portada);



        // Crear el libro en la base de datos
        const libro = await Libro.create({
            nombreLibro,
            descripcion,
            autor,
            archivoUrl: archivoUrl,
            portadaUrl: portadaUrl,
            fkIdArea: areaId,
            fkIdSemestre: semestreId,
            fkIdMateria: materiaId
        });

        return res.status(201).json({ message: 'Libro creado con éxito', libro });
    } catch (error: any) {
        console.error('Error al crear el libro:', error);
        return res.status(500).json({ message: 'Error al crear el libro', error: error.message });
    }
};
