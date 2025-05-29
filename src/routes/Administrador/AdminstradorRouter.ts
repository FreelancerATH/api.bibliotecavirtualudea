import { Router } from "express";
import { AdministradorController } from "../../controllers/Administrador/AdministradorController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../../middleware/validation";
import { AdminService } from '../../controllers/Administrador/Administrador.Service';
import { AuthMiddleware } from "../../middleware/Admin.middleware";



export class AdminRoutes {

  static get routes(): Router {
    const router = Router();
    const adminService = new AdminService();
    const administradorController = new AdministradorController(adminService);


    //Login y Registro de administradores
    router.post("/createAdmin",
      //AuthMiddleware.validateJWT,
      body("correo")
        .isString().withMessage("El correo debe ser una cadena")
        .notEmpty().withMessage("El correo es obligatorio")
        .isEmail().withMessage("El correo no es válido")
        .isLength({ max: 100 }).withMessage("El correo no puede exceder los 100 caracteres"),
      body("password")
        .isString().withMessage("El password debe ser una cadena")
        .notEmpty().withMessage("El password es obligatorio")
        .isLength({ min: 6 }).withMessage("El password debe tener al menos 6 caracteres")
        .isLength({ max: 16 }).withMessage("El password no puede exceder los 16 caracteres"),
      body("nombre")
        .isString().withMessage("El nombre debe ser una cadena")
        .notEmpty().withMessage("El nombre es obligatorio")
        .isLength({ max: 50 }).withMessage("El nombre no puede exceder los 50 caracteres"),
      body("telefono")
        .notEmpty().withMessage("El telefono es obligatorio")
        .isMobilePhone('es-MX').withMessage("El telefono no es válido")
        .isLength({ max: 10 }).withMessage("El teléfono no puede exceder los 210 caracteres"),
      body("area")
        .notEmpty().withMessage("El area es obligatorio")
        .isNumeric().withMessage("El area debe ser un número"),
      handleInputErrors,
      administradorController.createAdmin);

    router.post("/login",
      body("correo")
        .isString().withMessage("El correo debe ser una cadena")
        .notEmpty().withMessage("El correo es obligatorio")
        .isEmail().withMessage("El correo no es válido")
        .isLength({ max: 100 }).withMessage("El correo no puede exceder los 100 caracteres"),
      body("password")
        .isString().withMessage("El password debe ser una cadena")
        .notEmpty().withMessage("El password es obligatorio")
        .isLength({ min: 6 }).withMessage("El password debe tener al menos 6 caracteres")
        .isLength({ max: 16 }).withMessage("El password no puede exceder los 16 caracteres"),
      handleInputErrors,
      administradorController.login);

    router.put("/updatePasswordAdminByEmail/:email",
      //AuthMiddleware.validateJWT,
      body("password")
        .isString().withMessage("El password debe ser una cadena")
        .notEmpty().withMessage("El password es obligatorio")
        .isLength({ min: 6 }).withMessage("El password debe tener al menos 6 caracteres")
        .isLength({ max: 16 }).withMessage("El password no puede exceder los 16 caracteres"),
      handleInputErrors,
      administradorController.updatePasswordAdmins
    )

    //CRUD de administradores
    router.get("/getAllAdmins",
      //AuthMiddleware.validateJWT,
      administradorController.getAllAdmins
    );

    router.get("/getAdminByEmail/:email",
      //AuthMiddleware.validateJWT,
      param("email")
        .notEmpty().withMessage("El argumento email no debe estar vacio")
        .isEmail().withMessage("El argumento email no es un correo valido")
        .isString().withMessage("El correo debe ser una cadena"),
      administradorController.getAdminByEmail
    );

    router.put("/updateAdminByEmail/:email",
      //AuthMiddleware.validateJWT,
      administradorController.updateAdminByEmail
    );

    router.delete("/deleteAdminByEmail/:email",
      AuthMiddleware.validateAdmin,
      administradorController.deleteAdminByEmail
    );

    return router;
  }
}

