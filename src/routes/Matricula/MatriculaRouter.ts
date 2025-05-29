import { Router } from 'express';
import { body, param } from 'express-validator';
import { handleInputErrors } from '../../middleware/validation';
import { MatriculaController } from '../../controllers/Matricula/MatriculaController';

const router = Router();

// Crear Matrícula
router.post('/createMatricula',
    body('matricula')
        .notEmpty().withMessage('La matrícula es obligatoria'),
    handleInputErrors,
    MatriculaController.createMatricula
);

// Obtener todas las matrículas
router.get('/',
    MatriculaController.getAllMatriculas
);

// Eliminar Matrícula
router.delete('/:id',
    param('id')
        .isNumeric().withMessage('ID no válido'),
    handleInputErrors,
    MatriculaController.deleteMatriculaById
);

// Actualizar Matrícula
router.put('/:id',
    param('id')
        .isNumeric().withMessage('ID no válido'),
    body('matricula')
        .notEmpty().withMessage('La matrícula es obligatoria'),
    handleInputErrors,
    MatriculaController.updateMatriculaById
);

export default router;
