import { Router } from 'express';
import { body, param } from 'express-validator';
import SemestreController from '../../controllers/Semestre/SemestreController';
import { handleInputErrors } from '../../middleware/validation';

const router = Router();

router.get('/', SemestreController.getAll);

router.get('/:id',
  param('id').isInt().withMessage('ID inválido'),
  handleInputErrors,
  SemestreController.getById
);

// Obtener semestres por ID de área
router.post('/',
  body('nombreSemestre').notEmpty().withMessage('Nombre requerido'),
  body('fkIdArea').isInt().withMessage('Área requerida y debe ser numérica'),
  handleInputErrors,
  SemestreController.create
);

router.put('/:id',
  param('id').isInt().withMessage('ID inválido'),
  body('nombreSemestre').optional().notEmpty(),
  body('fkIdArea').optional().isInt(),
  handleInputErrors,
  SemestreController.update
);

router.delete('/:id',
  param('id').isInt().withMessage('ID inválido'),
  handleInputErrors,
  SemestreController.delete
);

export default router;
