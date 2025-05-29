import { Request, Response } from 'express';
import Libro from '../../data/mysql/models/Libro';
import Area from '../../data/mysql/models/Area';
import { Op } from 'sequelize';
import Semestre from '../../data/mysql/models/Semestre';
import Materia from '../../data/mysql/models/Materia';

export const searchBooks = async (req: Request, res: Response) => {
  try {
    // Obtener los parámetros de la consulta (query params)
    const { nombreLibro, fkIdArea, fkIdSemestre, fkIdMateria, idLibro } = req.query;

    // Crear un objeto con los filtros que no estén vacíos
    const whereConditions: any = {};

    // Si se pasa un idLibro, buscar solo ese libro
    if (idLibro) {
      whereConditions.idLibro = idLibro;  // Cambiar id por idLibro
    } else {
      // Si no se pasa un idLibro, aplicar otros filtros
      if (nombreLibro) whereConditions.nombreLibro = { [Op.like]: `%${nombreLibro}%` };  // Búsqueda parcial por nombre
      if (fkIdArea) whereConditions.fkIdArea = fkIdArea;
      if (fkIdSemestre) whereConditions.fkIdSemestre = fkIdSemestre;
      if (fkIdMateria) whereConditions.fkIdMateria = fkIdMateria;
    }

    // Buscar libros aplicando los filtros (si existen)
    const libros = await Libro.findAll({
      where: whereConditions,
      include: [
        { model: Area, attributes: ['nombreArea'] },
        { model: Semestre, attributes: ['nombreSemestre'] },
        { model: Materia, attributes: ['nombreMateria'] }
      ]
    });

    if (!libros || libros.length === 0) {
      return res.status(404).json({ message: 'No se encontraron libros' });
    }

    return res.status(200).json(libros);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al realizar la búsqueda de libros' });
  }
};
