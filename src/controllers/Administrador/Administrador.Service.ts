
import Administrador from '../../data/mysql/models/Administrador';
import { CustomError } from '../../errors';
import { bcryptAdapter } from '../../config';
import { AdminEntity } from '../../entities/admin.entity';
import Area from '../../data/mysql/models/Area';
import { RegisterAdminDTO, LoginAdminDTO } from './dtos/index';
import { JwtAdapter } from '../../config/jwt.adapte';

export class AdminService {
  constructor() { }


  /**
   * loginAdmin
   * @description Metodo para crear un administrador
   * @param registerAdminDto
   * @returns
   * @throws CustomError
   */
  public async createAdmin(registerAdminDto: RegisterAdminDTO) {
    //*Verificamos si el correo esta registrado
    const existAdmin = await Administrador.findOne({
      where: {
        correo: registerAdminDto.correo,
      },
    });

    //*Verificar que exista una area con el id dado en el dto, en el squema de la tabla area
    const areaExist = await Area.findOne({
      where: {
        id: registerAdminDto.area, // Asegúrate de que el campo coincida con el nombre en tu modelo de Area
      },
    });

    if (!areaExist) throw CustomError.badRequest('El área no existe');
    if (existAdmin) throw CustomError.badRequest('El correo ya esta registrado');

    try {

      //*Creamos el administrador
      const newAdmin = await Administrador.create({
        "correo": registerAdminDto.correo,
        "nombre": registerAdminDto.nombre,
        "telefono": registerAdminDto.telefono,
        "password": bcryptAdapter.hash(registerAdminDto.password),
        "fkIdArea": +registerAdminDto.area,
        "rol": 'admin',
        "verificado": false
      });
      //*Guardamos el administrador
      await newAdmin.save();

      //*Creamos el objeto de administrador
      const admin = AdminEntity.fromObject(newAdmin);

      const token = await JwtAdapter.generateToken({
        correo: admin.correo,
        rol: admin.rol,
      });
console.log(token)
      if (!token) throw CustomError.internalServerError('Error al generar el token');

      //*Retornamos el administrador
      const { password, ...adminEntity } = admin;
      return {
        admin: adminEntity,
        token
      };

    } catch (error) {
      console.log(error);
      throw CustomError.internalServerError('Error al crear el administrador');
    }

  }

  /**
   * loginAdmin
   * @description Metodo para actualizar la contraseña de un administrador
   * @param email
   * @param password
   * @returns
   * @throws CustomError
   * 
   */
  updatePasswordAdmins = async (email: string, password: string) => {
    if (!email) throw CustomError.badRequest('El id es obligatorio');
    if (!password) throw CustomError.badRequest('La contraseña es obligatoria');

    const admin = await Administrador.findOne({
      where: {
        correo: email,
      },
    });

    if (!admin) throw CustomError.notFound('No se encontró el administrador');

    const { password: passwordAdmin, ...restAdmin } = AdminEntity.fromObject(admin);

    try {
      const newPassword = bcryptAdapter.hash(password);

      await Administrador.update({
        password: newPassword
      }, {
        where: {
          correo: email,
        },
      });

      return {
        message: 'Contraseña actualizada correctamente',
        admin: restAdmin
      };
    } catch (error) {
      console.log(error);
      throw CustomError.internalServerError('Error al actualizar la contraseña');
    }


  }

  /**
   * loginAdmin
   * @description Método para iniciar sesión como administrador
   * @param loginAdminDto
   * @returns
   * @throws CustomError
   */
  public async loginAdmin(loginAdminDto: LoginAdminDTO) {
    const existAdmin = await Administrador.findOne({
      where: { correo: loginAdminDto.correo },
    });
  
    if (!existAdmin) throw CustomError.badRequest('Credenciales inválidas');
  
    const isMatch = await bcryptAdapter.compare(
      loginAdminDto.password,
      existAdmin.password
    );
  
    if (!isMatch) throw CustomError.badRequest('Credenciales inválidas');
  
    const { correo, nombre, rol } = AdminEntity.fromObject(existAdmin);
  
    const cookieLogin = await JwtAdapter.generateToken(
      { correo, rol },
      3600 // 1 hour in seconds
    );
  
    return {
      cookieLogin,
      usuario: {
        correo,
        nombre,
        rol
      },
    };
  }
  

  /**
   * getAllAdmins
   * @description Método para obtener todos los administradores
   * @returns
   * @throws CustomError
   */
  public async getAllAdmins() {
    const admins = await Administrador.findAll({
      where: {
        rol: 'admin'
      }
    });

    if (!admins) throw CustomError.notFound('No hay administradores registrados');

    const adminEntities = admins.map(admin => AdminEntity.fromObject(admin));

    const adminEntitiesFiltered = await Promise.all(
      adminEntities.map(async (admin) => {
        const areaInfo = await Area.findOne({
          where: { id: admin.fkIdArea },
        });

        return {
          nombre: admin.nombre,
          correo: admin.correo,
          telefono: admin.telefono,
          area: areaInfo ? areaInfo.nombreArea : null,
        };
      })
    );

    return {
      admins: adminEntitiesFiltered
    };
  }

  /**
   * getAdminByEmail
   * @description Método para obtener un administrador por su correo
   * @param email
   * @returns
   * @throws CustomError
   */
  public async getAdminByEmail(email: string) {

    if (!email) throw CustomError.badRequest('El id es obligatorio');

    const admin = await Administrador.findOne({
      where: {
        correo: email,
      },
    });

    if (!admin) throw CustomError.notFound('No se encontró el administrador');

    const areaInfo = await Area.findOne({
      where: { id: admin.fkIdArea },
    });

    return {
      nombre: admin.nombre,
      correo: admin.correo,
      telefono: admin.telefono,
      area: areaInfo ? areaInfo.nombreArea : null,
    };


  }

  /**
   * updateAdminByEmail
   * @description Método para actualizar un administrador por su correo
   * @param email
   * @param body
   * @returns
   * @throws CustomError
   */
  public async updateAdminByEmail(email: string, body: any) {
    if (!email) throw CustomError.badRequest('El id es obligatorio');
    if (body.rol) throw CustomError.badRequest('EL rol no puede ser cambiado');
    if (body.password) throw CustomError.badRequest('La contraseña no puede ser cambiada');


    const admin = await Administrador.findOne({
      where: {
        correo: email,
      },
    });

    if (!admin) throw CustomError.notFound('No se encontró el administrador');

    await Administrador.update({
      ...body,
      "fkIdArea": body.area
    }, {
      where: {
        correo: email,
      },
    });
    const newAdmin = await Administrador.findOne({
      where: {
        correo: email,
      },
    });
    const { password: passwordAdmin, ...restAdmin } = AdminEntity.fromObject(admin);
    const { password, ...restNewAdmin } = AdminEntity.fromObject(newAdmin!);

    return {
      message: 'Administrador actualizado',
      previousAdmin: restAdmin,
      newAdmin: restNewAdmin
    };
  }

  /**
   * deleteAdminByEmail
   * @description Método para eliminar un administrador por su correo
   * @param email
   * @returns
   * @throws CustomError
   */
  public async deleteAdminByEmail(email: string) {

    if (!email) throw CustomError.badRequest('El email es obligatorio');

    const admin = await Administrador.findOne({
      where: { correo: email },
    });
    if (!admin) {
      throw CustomError.notFound('No se encontró el administrador');
    }

    // Guardamos los datos (sin password) para informarlos en la respuesta
    const { password, ...restAdmin } = AdminEntity.fromObject(admin);

    // Eliminamos el registro de la base de datos
    await admin.destroy();

    return {
      message: 'Administrador eliminado correctamente',
      deletedAdmin: restAdmin,
    };

  }
}