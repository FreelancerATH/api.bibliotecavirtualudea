import { Request, Response } from 'express';
import Libro from '../../data/mysql/models/Libro';
import Area from '../../data/mysql/models/Area';
import Semestre from '../../data/mysql/models/Semestre';
import Materia from '../../data/mysql/models/Materia';

export const getBookById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;  // El parámetro es 'id'

        // Usamos idLibro para buscar el libro por su clave primaria
        const libro = await Libro.findByPk(id, {
            include: [
                { model: Area, attributes: ['nombreArea'] },
                { model: Semestre, attributes: ['nombreSemestre'] },
                { model: Materia, attributes: ['nombreMateria'] }
            ]
        });

        // Verificar si no se encontró el libro
        if (!libro) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }

        // Devolvemos el libro encontrado
        return res.status(200).json(libro);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener el libro' });
    }
};
