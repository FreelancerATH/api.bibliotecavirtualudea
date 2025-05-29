import { CustomError } from "../errors";


export class AdminEntity {


  constructor(
    public correo: string,
    public nombre: string,
    public telefono: string,
    public password: string,
    public fkIdArea: number,
    public rol: string
  ) { }

  static fromObject(object: { [key: string]: any }) {
    const {
      correo,
      nombre,
      telefono,
      password,
      fkIdArea,
      rol } = object;


    if (!nombre) {
      throw CustomError.badRequest("El nombre es requerido");
    }
    if (!correo) {
      throw CustomError.badRequest("El correo es requerido");
    }
    if (!telefono) {
      throw CustomError.badRequest("El telefono es requerido");
    }
    if (!password) {
      throw CustomError.badRequest("El password es requerido");
    }

    if (!rol) {
      throw CustomError.badRequest("El rol es requerido");
    }

    if (!fkIdArea) {
      throw CustomError.badRequest("El area es requerida");
    }

    return new AdminEntity(correo, nombre, telefono, password, fkIdArea, rol);
  }
}