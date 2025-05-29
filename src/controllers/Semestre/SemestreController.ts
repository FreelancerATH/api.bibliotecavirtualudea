import { Request, Response } from 'express';
import Semestre from '../../data/mysql/models/Semestre';
import Area from '../../data/mysql/models/Area';
import Materia from '../../data/mysql/models/Materia';

class SemestreController {
  static async getAll(req: Request, res: Response) {
    const { fkIdArea } = req.query;
  
    try {
      const semestres = await Semestre.findAll({
        where: fkIdArea ? { fkIdArea: Number(fkIdArea) } : {},
        include: [Area, Materia],
      });
  
      res.json(semestres);
    } catch (error) {
      console.error("Error al obtener semestres:", error);
      res.status(500).json({ message: "Error al obtener semestres" });
    }
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const data = await Semestre.findByPk(id, { include: [Area, Materia] });
    data ? res.json(data) : res.status(404).json({ message: 'No encontrado' });
  }

  static async create(req: Request, res: Response) {
    const data = await Semestre.create(req.body);
    res.status(201).json(data);
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const [updated] = await Semestre.update(req.body, { where: { idSemestre: id } });
    updated ? res.json({ message: 'Actualizado' }) : res.status(404).json({ message: 'No encontrado' });
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    const deleted = await Semestre.destroy({ where: { idSemestre: id } });
    deleted ? res.json({ message: 'Eliminado' }) : res.status(404).json({ message: 'No encontrado' });
  }
}

export default SemestreController;