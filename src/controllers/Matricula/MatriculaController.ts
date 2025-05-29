import { Request, Response } from 'express';
import Matricula from '../../data/mysql/models/Matricula';
import  sequelize  from './../../data/mysql/udea.database'

export class MatriculaController {

    static createMatricula = async (req: Request, res: Response) => {
        const { matricula } = req.body;

        try {
            const nuevaMatricula = await Matricula.create({ matricula });
            res.send('Matrícula creada');
        } catch (error) {
            console.log(error);
            res.status(500).send('Hubo un error al crear la matrícula');
        }
    }

    static getAllMatriculas = async (req: Request, res: Response) => {
        try {
            const matriculas = await Matricula.findAll();
            res.json(matriculas);
        } catch (error) {
            console.log({ error });
            res.status(500).send('Hubo un error');
        }
    }

    static deleteMatriculaById = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const matricula = await Matricula.findByPk(id);
            if (!matricula) {
                res.send('Matrícula no encontrada');
                return;
            }

            await matricula.destroy();
            res.send('Matrícula eliminada');
        } catch (error) {
            console.log(error);
            res.status(500).send('Hubo un error al eliminar la matrícula');
        }
    }

    static updateMatriculaById = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { matricula } = req.body;

        try {
            const matriculaRecord = await Matricula.findByPk(id);
            if (!matriculaRecord) {
                res.send('Matrícula no encontrada');
                return;
            }

            matriculaRecord.matricula = matricula;
            await matriculaRecord.save();
            res.send('Matrícula actualizada');
        } catch (error) {
            console.log(error);
            res.status(500).send('Hubo un error al actualizar la matrícula');
        }
    }
}
