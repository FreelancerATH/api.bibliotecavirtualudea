
import {Router } from 'express'
import {body, param} from 'express-validator'
import { handleInputErrors } from '../../middleware/validation'
import { AlumnoController } from '../../controllers/Alumno/AlumnoController'


const router = Router()


//user 


router.post('/CreateUser',
    // Validación para nombre
    body('nombre')
      .notEmpty().withMessage('El nombre del Usuario es Obligatorio')
      .isLength({ max: 50 }).withMessage('El nombre no puede exceder los 50 caracteres'),
  

    body('correo')
      .notEmpty().withMessage('El email es Obligatorio')
      .isEmail().withMessage('Email no válido')
      .isLength({ max: 255 }).withMessage('El email no puede exceder los 255 caracteres'),
  
 
    body('password')
      .notEmpty().withMessage('El password es Obligatorio')
      .isLength({ min: 6 }).withMessage('El password debe ser mayor a 6 caracteres')
      .isLength({ max: 255 }).withMessage('El password no puede exceder los 255 caracteres'),
  

    body('matricula')
      .notEmpty().withMessage('La matrícula es Obligatoria')
      .isLength({ min: 11, max:12 }).withMessage('La matrícula debe tener exactamente 11 caracteres'),
  

    body('telefono')
      .optional()
      .isInt().withMessage('El teléfono debe ser un número entero')
      .isLength({ max: 20 }).withMessage('El teléfono no puede exceder los 20 caracteres'),
  
    body('areaAcademica')

      .isInt().withMessage('El área académica debe ser un número entero'),


    handleInputErrors,

    AlumnoController.createUser
  );


//obtenr user por id
router.get('/:matricula',
    AlumnoController.getUserByMatricula)


//obtener todos los usuarios
router.get('/',
        AlumnoController.getAllAlumnos)


//updateUser
    router.put('/:correo',
      body('nombre')
      .notEmpty().withMessage('El nombre del Usuario es Obligatorio')
      .isLength({ max: 50 }).withMessage('El nombre no puede exceder los 50 caracteres'),
  

    body('correo')
      .notEmpty().withMessage('El email es Obligatorio')
      .isEmail().withMessage('Email no válido')
      .isLength({ max: 255 }).withMessage('El email no puede exceder los 255 caracteres'),
  
 
      body('telefono')
      .optional()
      .isInt().withMessage('El teléfono debe ser un número entero')
      .isLength({ max: 20 }).withMessage('El teléfono no puede exceder los 20 caracteres'),

        AlumnoController.updateUser)

       


 /* Routes for tasks */

export default router
