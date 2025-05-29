import { Request, Response } from 'express';
import Libro from '../../data/mysql/models/Libro';
import fs from 'fs';
import path from 'path';

export const deleteBook = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;

        // Buscar el libro por ID
        const libro = await Libro.findByPk(id);
        if (!libro) {
            return res.status(404).json({ message: `Libro con ID ${id} no encontrado` });
        }

        let message = `Libro con ID ${id} encontrado. Iniciando eliminación... `;

        // Si existe un archivo asociado, eliminarlo
        if (libro.archivoUrl) {
            // Corregir la ruta para que apunte correctamente al directorio 'uploads/libros'
            const filePath = path.join(__dirname, '../../../uploads', libro.archivoUrl);  // Asegúrate de que solo apunte a 'libros/'

            try {
                await fs.promises.access(filePath);  // Verifica si el archivo existe
                await fs.promises.unlink(filePath);  // Eliminar el archivo
                message += `Archivo '${libro.archivoUrl}' eliminado correctamente. `;
                console.log('Archivo eliminado:', filePath);
            } catch (error) {
                // Si no se puede acceder al archivo
                console.error('Error al eliminar el archivo:', error);
                return res.status(500).json({ message: `Error al eliminar el archivo asociado '${libro.archivoUrl}'`, error: (error as Error).message });
            }
        } else {
            message += `No se encontró archivo asociado para eliminar. `;
        }

        // Si existe una portada asociada, eliminarla
        if (libro.portadaUrl) {
            // Corregir la ruta para que apunte correctamente al directorio 'uploads/portadas'
            const coverPath = path.join(__dirname, '../../../uploads',libro.portadaUrl);  // Asegúrate de que solo apunte a 'portadas/'

            try {
                await fs.promises.access(coverPath);  // Verifica si la portada existe
                await fs.promises.unlink(coverPath);  // Eliminar la portada
                message += `Portada '${libro.portadaUrl}' eliminada correctamente. `;
                console.log('Portada eliminada:', coverPath);
            } catch (error) {
                // Si no se puede acceder a la portada
                console.error('Error al eliminar la portada:', error);
                message += `No se encontró portada asociada para eliminar. `;
            }
        } else {
            message += `No se encontró portada asociada para eliminar. `;
        }

        // Eliminar el libro de la base de datos
        try {
            await libro.destroy();
            message += `Libro eliminado de la base de datos. `;
            return res.status(200).json({ message: message });  // Regresa el mensaje completo
        } catch (error) {
            console.error('Error al eliminar el libro de la base de datos:', error);
            return res.status(500).json({ message: 'Error al eliminar el libro de la base de datos', error: (error as Error).message });
        }

    } catch (error) {
        console.error('Error general en el proceso de eliminación:', error);
        return res.status(500).json({ message: 'Error al eliminar el libro', error: (error as Error).message });
    }
};
