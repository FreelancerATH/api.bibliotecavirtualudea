import { Router } from 'express';
import { body, param } from 'express-validator';
import MateriaController from '../../controllers/Materia/MateriaController';
import { handleInputErrors } from '../../middleware/validation';


const router = Router();

router.get('/', MateriaController.getAll);

router.get('/:id',
  param('id').isInt().withMessage('ID inválido'),
  handleInputErrors,
  MateriaController.getById
);

//Se moifico este metodo post, detalle en el controlador de materia
router.post(
  '/',
  body('nombreMateria').notEmpty().withMessage('Nombre requerido'),
  body('fkIdArea').isInt().withMessage('Área requerida y numérica'),
  body('fkIdSemestre').isInt().withMessage('Semestre requerido y numérico'),
  handleInputErrors,
  async (req, res, next) => {
    try {
      await MateriaController.create(req, res);
    } catch (error) {
      next(error); // Pasa el error al middleware de manejo de errores
    }
    }
  );

router.put('/:id',
  param('id').isInt(),
  body('nombreMateria').optional().notEmpty(),
  body('fkIdArea').optional().isInt(),
  body('fkIdSemestre').optional().isInt(),
  handleInputErrors,
  MateriaController.update
);

router.delete('/:id',
  param('id').isInt(),
  handleInputErrors,
  MateriaController.delete
);

export default router;
