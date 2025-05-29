
import {Router } from 'express'
import {body, param} from 'express-validator'
import { handleInputErrors } from '../../middleware/validation'
import { AuthAlumnoController } from '../../controllers/AuthAlumn/AuthAlumnController'


const router = Router()



router.post('/loginAlumno',

    body('correo')
        .notEmpty().withMessage('El email es Obligatorio'),
    body('password')
        .notEmpty().withMessage('el password es Obligatorio'),
        
    handleInputErrors,
    
    AuthAlumnoController.loginUser)


    //confirmar cuenta
    router.get('/confirmar/:token', (req, res, next) => {
        AuthAlumnoController.validateToken(req, res).catch(next);
    }); 
    
    
    router.post('/resetPassword',
    
        body('correo')
            .notEmpty().withMessage('El email es Obligatorio')
            .isEmail().withMessage('Email no valido'),
       handleInputErrors,

        AuthAlumnoController.resetPassword)

  router.post('/forgotPassword/:token',
    body('password')
    .isLength({min:6}).withMessage('El password debe ser mayor a 6 caracteres'),
    handleInputErrors,
    AuthAlumnoController.forgotPassword)


       


 /* Routes for tasks */

export default router