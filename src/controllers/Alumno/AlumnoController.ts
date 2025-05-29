import type { Request, Response } from "express";
import User from "../../data/mysql/models/Alumno";
import { generarId } from "../../helpers/tokens";
import { emailRegistro } from "../../helpers/emails";
import bcrypt from "bcrypt";
import Alumno from "../../data/mysql/models/Alumno";
import Matricula from "../../data/mysql/models/Matricula";

export class AlumnoController {
  static createUser = async (req: Request, res: Response) => {
    const { matricula, nombre, correo, password, telefono, areaAcademica } = req.body;
  
    try {
      // Verificar si la matrícula ya está registrada en la tabla 'matricula'
      const matriculaExistente = await Matricula.findOne({ where: { matricula } });
  
      if (!matriculaExistente) {
        res.status(400).send("La matrícula no está registrada en el sistema");
        return;
      }
  
      // Verificar si el usuario ya existe en la tabla 'alumno'
      const [existeUsuario, existeUserCorreo] = await Promise.all([
        Alumno.findByPk(matricula),
        Alumno.findOne({ where: { correo } }),
      ]);
  
      if (existeUsuario || existeUserCorreo) {
        res.status(400).send("El usuario o el correo ya existen");
        return;
      }
  
      // Hashear la contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Crear el nuevo alumno
      const usuario = await Alumno.create({
        matricula,
        nombre,
        telefono,
        correo,
        password: hashedPassword,
        areaAcademica,
        codigoVerificacion: generarId(),
      });
  
      // Enviar el email de confirmación
      emailRegistro({
        nombre: usuario.nombre!,
        correo: usuario.correo!,
        codigoVerificacion: usuario.codigoVerificacion!,
      });
  
      // Responder al cliente
      res.status(200).send("Se ha enviado un email de confirmación");
  
    } catch (error) {
      console.log(error);
      res.status(500).send("Hubo un error, intenta de nuevo");
    }
  }; 

  static getUserByMatricula = async (req: Request, res: Response) => {
    const { matricula } = req.params;
    try {
      const user = await Alumno.findOne({
        where: { matricula},
        attributes: {
          exclude: ['password', 'codigoVerificacion', 'createdAt', 'updatedAt'],
        },
        include:['area']
      });

      if (!user) {
        res.send("usuario no encontrado");
        return;
      }


      res.send(user).status(200);
    } catch (error) {
      console.log(error);
      res.send("hubo un error").status(500);
    }
  };

  static getAllAlumnos = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = 10;
      const offset = (page - 1) * pageSize;

      const users = await Alumno.findAll({
        limit: pageSize,
        offset: offset,

        attributes: {
          exclude: ['password', 'codigoVerificacion', 'createdAt', 'updatedAt'],
        },
        include:['area']
      });

      const totalUsers = await Alumno.count();

      res.json({
        users,
        totalPages: Math.ceil(totalUsers / pageSize),
        currentPage: page,
        totalUsers,
      });
    } catch (error) {
      console.log({ error });
      res.status(500).send("Hubo un error");
    }
  };

  static updateUser = async (req: Request, res: Response) => {
    const { correo : email } = req.params;
    const { correo, nombre, telefono } = req.body;

    try {
      const user = await Alumno.findOne({ where: { correo: email } });

      if (!user) {
         res.status(404).send("Usuario no encontrado");
          return;
        }


      if (correo) {
        user.correo = correo;  // Actualizar correo
      }

      if (nombre) {
        user.nombre = nombre;  // Actualizar nombre
      }

      if (telefono) {
        
        user.telefono = telefono;  // Actualizar teléfono
      }


      await user.save();


      res.status(200).json({
        message: "Usuario actualizado exitosamente",
        user: {
          matricula: user.matricula,
          nombre: user.nombre,
          correo: user.correo,

        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Hubo un error al actualizar el usuario");
    }
  };

}
