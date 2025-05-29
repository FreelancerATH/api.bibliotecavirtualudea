
import {Router } from 'express'
import {body, param} from 'express-validator'
import { handleInputErrors } from '../../middleware/validation'
import { AuthAlumnoController } from '../../controllers/AuthAlumn/AuthAlumnController'
import { AreaController } from '../../controllers/Area/AreaController'


const router = Router()



router.post('/createArea',

    body('nombreArea')
        .notEmpty().withMessage('El nombre de area Obligatoria'),
    handleInputErrors,
    
    AreaController.createArea)

  router.delete('/:id',
        param('id')
       .isNumeric().withMessage('id no valido'),
    handleInputErrors,
        AreaController.deleteAreaById)



        router.put('/:id',
            param('id')
           .isNumeric().withMessage('id no valido'),
              body('nombreArea')
              .notEmpty().withMessage('El nombre del area es obligatorio'),
        handleInputErrors,
            AreaController.updateAreaById)

    
    router.get('/', AreaController.getAllAreas)


       



export default router