import { Request, Response } from 'express';
import { RegisterAdminDTO } from './dtos/';
import { AdminService } from './Administrador.Service';
import { CustomError } from '../../errors';
import { LoginAdminDTO } from './dtos/Login-Admin.dto';
import { stringify } from 'querystring';


export class AdministradorController {

  //Constructor
  constructor(
    public readonly adminService: AdminService
  ) { }

  private handleError(error: any, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    } else {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  //Creacion de administradores
  createAdmin = (req: Request, res: Response) => {

    const [error, adminDto] = RegisterAdminDTO.createAdmin(req.body);

    if (error) res.status(400).json({ error });

    this.adminService
      .createAdmin(adminDto!)
      .then((admin) => {
        res.status(201).json(admin);
      })
      .catch(error => this.handleError(error, res));

  }

  updatePasswordAdmins = (req: Request, res: Response) => {
    this.adminService
      .updatePasswordAdmins(req.params.email, req.body.password)
      .then((admin) => {
        res.status(200).json(admin);
      })
      .catch(error => this.handleError(error, res));
  }


  //*Inicio de sesion de administradores
  login = (req: Request, res: Response) => {
    const [error, adminDto] = LoginAdminDTO.createAdmin(req.body);

    if (error) res.status(400).json({ error });

    this.adminService
      .loginAdmin(adminDto!)
      .then((admin) => {
        res.status(200).json(admin);
      })
      .catch(error => this.handleError(error, res));

  }




  //CRUD de administradores

  getAllAdmins = (req: Request, res: Response) => {
    this.adminService
      .getAllAdmins()
      .then((admins) => {
        res.status(200).json(admins);
      })
      .catch(error => this.handleError(error, res));

  }

  getAdminByEmail = (req: Request, res: Response) => {
    if (!req.params.email) throw CustomError.badRequest('El correo es obligatorio');
    this.adminService
      .getAdminByEmail(req.params.email)
      .then((admin) => {
        res.status(200).json(admin);
      })
      .catch(error => this.handleError(error, res));
  }

  updateAdminByEmail = (req: Request, res: Response) => {
    this.adminService
      .updateAdminByEmail(req.params.email, req.body)
      .then((admin) => {
        res.status(200).json(admin);
      })
      .catch(error => this.handleError(error, res));
  }

  deleteAdminByEmail = (req: Request, res: Response) => {

    this.adminService
      .deleteAdminByEmail(req.params.email)
      .then(admin => res.status(200).json(admin))
      .catch(error => this.handleError(error, res));
  }

}