import { Request, Response } from 'express';
import Libro from '../../data/mysql/models/Libro';
import Area from '../../data/mysql/models/Area';
import Semestre from '../../data/mysql/models/Semestre';
import Materia from '../../data/mysql/models/Materia';
import fs from 'fs/promises';
import path from 'path';

export const updateBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { nombreLibro, descripcion, autor, fkIdArea, fkIdSemestre, fkIdMateria } = req.body;

        // Define la estructura esperada de los archivos
        interface CustomFile {
            filename: string;
        }

        interface CustomFiles {
            archivo?: CustomFile[];  // El archivo del libro (PDF o DOCX)
            portada?: CustomFile[];  // La imagen de portada
        }

        // Accede a los archivos cargados
        const files = req.files as CustomFiles | undefined;
        const archivo = files?.archivo?.[0];  // El libro en PDF o DOCX
        const portada = files?.portada?.[0];  // La imagen de portada

        // Busca el libro en la base de datos
        const libro = await Libro.findByPk(id);
        if (!libro) {
            res.status(404).json({ message: 'Libro no encontrado' });
            return;  // Evita que el código continúe ejecutándose después de la respuesta
        }

        let archivoUrl = libro.archivoUrl;  // Mantiene la URL del archivo actual
        let portadaUrl = libro.portadaUrl;  // Mantiene la URL de la portada actual

        // 📌 Manejo del archivo del libro (PDF o DOCX)
        if (archivo) {
            const oldFilePath = path.join(__dirname, '../../../uploads', libro.archivoUrl);  // Ruta del archivo antiguo
            try {
                await fs.access(oldFilePath);  // Verifica si el archivo antiguo existe
                await fs.unlink(oldFilePath);  // Elimina el archivo antiguo
                console.log('Archivo antiguo eliminado:', oldFilePath);
            } catch (error) {
                console.warn('No se encontró el archivo antiguo, puede haber sido eliminado previamente.');
            }
            archivoUrl = `libros/${archivo.filename}`;  // Asigna la nueva ruta al archivo
        }

        // 📌 Manejo de la portada (imagen)
        if (portada) {
            const oldCoverPath = path.join(__dirname, '../../../uploads', libro.portadaUrl);  // Ruta de la portada antigua
            try {
                await fs.access(oldCoverPath);  // Verifica si la portada antigua existe
                await fs.unlink(oldCoverPath);  // Elimina la portada antigua
                console.log('Portada antigua eliminada:', oldCoverPath);
            } catch (error) {
                console.warn('No se encontró la portada antigua, puede haber sido eliminada previamente.');
            }
            portadaUrl = `portadas/${portada.filename}`;  // Asigna la nueva ruta a la portada
        }

        // ✅ Validar si los IDs de Area, Semestre y Materia existen
        if (fkIdArea) {
            const area = await Area.findByPk(fkIdArea);
            if (!area) {
                res.status(400).json({ message: `El área con ID ${fkIdArea} no existe` });
                return;  // Evita que el código continúe ejecutándose después de la respuesta
            }
        }
        if (fkIdSemestre) {
            const semestre = await Semestre.findByPk(fkIdSemestre);
            if (!semestre) {
                res.status(400).json({ message: `El semestre con ID ${fkIdSemestre} no existe` });
                return;  // Evita que el código continúe ejecutándose después de la respuesta
            }
        }
        if (fkIdMateria) {
            const materia = await Materia.findByPk(fkIdMateria);
            if (!materia) {
                res.status(400).json({ message: `La materia con ID ${fkIdMateria} no existe` });
                return;  // Evita que el código continúe ejecutándose después de la respuesta
            }
        }

        // 📌 Actualizar los datos del libro
        libro.nombreLibro = nombreLibro ?? libro.nombreLibro;
        libro.descripcion = descripcion ?? libro.descripcion;
        libro.autor = autor ?? libro.autor;
        libro.fkIdArea = fkIdArea ?? libro.fkIdArea;
        libro.fkIdSemestre = fkIdSemestre ?? libro.fkIdSemestre;
        libro.fkIdMateria = fkIdMateria ?? libro.fkIdMateria;
        libro.archivoUrl = archivoUrl ?? libro.archivoUrl;
        libro.portadaUrl = portadaUrl ?? libro.portadaUrl;

        // Guarda los cambios en la base de datos
        await libro.save();

        // Mensajes informativos de eliminación de archivos
        const mensajeArchivo = archivo ? `Archivo "${libro.archivoUrl}" eliminado y reemplazado por "${archivo.filename}".` : 'No se modificó el archivo del libro.';
        const mensajePortada = portada ? `Portada "${libro.portadaUrl}" eliminada y reemplazada por "${portada.filename}".` : 'No se modificó la portada.';

        // Enviar respuesta con los mensajes de éxito y detalles de los archivos eliminados
        res.status(200).json({
            message: 'Libro actualizado con éxito',
            libro,
            archivosEliminados: {
                archivo: mensajeArchivo,
                portada: mensajePortada
            }
        });

    } catch (error: any) {
        console.error('Error al actualizar el libro:', error);
        res.status(500).json({ message: 'Error al actualizar el libro', error: error.message });
    }
};
