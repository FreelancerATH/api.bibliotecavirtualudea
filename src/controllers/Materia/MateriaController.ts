import { Request, Response } from 'express';
import Materia from '../../data/mysql/models/Materia';
import Area from '../../data/mysql/models/Area';
import Semestre from '../../data/mysql/models/Semestre';

class MateriaController {
  static async getAll(req: Request, res: Response) {
    const data = await Materia.findAll({ include: [Area, Semestre] });
    res.json(data);
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const data = await Materia.findByPk(id, { include: [Area, Semestre] });
    data ? res.json(data) : res.status(404).json({ message: 'No encontrado' });
  }

  // Se modifico el controlador para que reciba el id del semestre y el id del area, ya que en la base de datos no se tiene el fkIdArea y fkIdSemestre, sino el idArea y el idSemestre
  static async create(req: Request, res: Response) {
    const { nombreMateria, fkIdSemestre, fkIdArea } = req.body;
  
    if (!nombreMateria || !fkIdSemestre || !fkIdArea) {
      return res.status(400).json({ message: "Datos incompletos" });
    }
  
    try {
      const materia = await Materia.create({ nombreMateria, fkIdSemestre, fkIdArea });
      res.status(201).json(materia);
    } catch (error) {
      console.error("Error al crear materia:", error);
      res.status(500).json({ message: "Error al crear materia" });
    }
  }
  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const [updated] = await Materia.update(req.body, { where: { idMateria: id } });
    updated ? res.json({ message: 'Actualizada' }) : res.status(404).json({ message: 'No encontrada' });
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    const deleted = await Materia.destroy({ where: { idMateria: id } });
    deleted ? res.json({ message: 'Eliminada' }) : res.status(404).json({ message: 'No encontrada' });
  }
}

export default MateriaController;