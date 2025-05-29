import { Request, Response } from 'express';
import Libro from '../../data/mysql/models/Libro';
import Area from '../../data/mysql/models/Area';
import Semestre from '../../data/mysql/models/Semestre';
import Materia from '../../data/mysql/models/Materia';
import { validationResult } from 'express-validator';
import path from 'path';
import fs from 'fs/promises';


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

        // Verificar si los archivos están presentes
        if (files) {
            // Verificar y procesar el archivo del libro (archivo)
            if (files.archivo && files.archivo[0]) {
                const file = files.archivo[0];
                const fileExtension = path.extname(file.originalname).toLowerCase();
                const allowedDocExtensions = ['.pdf', '.docx'];

                if (!allowedDocExtensions.includes(fileExtension)) {
                    await fs.unlink(file.path);  // Eliminar el archivo no permitido
                    return res.status(400).json({ message: 'El archivo debe ser .pdf o .docx' });
                }
                archivoUrl = `/libros/${file.filename}`;
            } else {
                return res.status(400).json({ message: 'El archivo del libro es obligatorio.' });
            }

            // Verificar y procesar la portada del libro (imagen)
            if (files.portada && files.portada[0]) {
                const portadaFile = files.portada[0];
                const portadaExtension = path.extname(portadaFile.originalname).toLowerCase();
                const allowedImageExtensions = ['.jpg', '.jpeg', '.png'];

                if (!allowedImageExtensions.includes(portadaExtension)) {
                    await fs.unlink(portadaFile.path);  // Eliminar la portada no permitida
                    return res.status(400).json({ message: 'La portada debe ser una imagen (.jpg, .jpeg, .png)' });
                }
                portadaUrl = `/portadas/${portadaFile.filename}`;
            } else {
                return res.status(400).json({ message: 'La portada del libro es obligatoria.' });
            }
        } else {
            return res.status(400).json({ message: 'Se deben subir los archivos de portada y libro.' });
        }

        // Crear el libro en la base de datos
        const libro = await Libro.create({
            nombreLibro,
            descripcion,
            autor,
            archivoUrl,
            portadaUrl,
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
