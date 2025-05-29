import { Request, Response } from 'express';
import Libro from '../../data/mysql/models/Libro';
import Area from '../../data/mysql/models/Area';
import Semestre from '../../data/mysql/models/Semestre';
import Materia from '../../data/mysql/models/Materia';

export const getBooks = async (req: Request, res: Response) => {
    try {
        const { offset = 0, limit = 25 } = req.query; // Offset por defecto es 0 y limit es 25

        // Límite máximo de resultados para evitar sobrecargar el servidor
        const maxLimit = 100;
        const finalLimit = Math.min(Number(limit), maxLimit);

        // Consultar libros con limit y offset (simula la paginación pero sin necesidad de botones de "siguiente")
        const libros = await Libro.findAll({
            limit: finalLimit, 
            offset: Number(offset), // El offset se incrementa a medida que el usuario hace scroll
            include: [
                { model: Area, attributes: ['nombreArea'] },
                { model: Semestre, attributes: ['nombreSemestre'] },
                { model: Materia, attributes: ['nombreMateria'] }
            ]
        });

        return res.status(200).json(libros);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener los libros' });
    }
};
