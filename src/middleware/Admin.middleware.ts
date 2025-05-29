import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../config/jwt.adapte";
import Administrador from "../data/mysql/models/Administrador";
import { AdminEntity } from "../entities/admin.entity";


export class AuthMiddleware {

  //*DI
  constructor() { }

  static async validateJWT(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers['authorization'];
    if (!authorization) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }
    if (!authorization.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Invalid Bearer token' });
      return;
    }
    const tokenValue = authorization.split(' ').at(1) || '';

    try {
      const payload = await JwtAdapter.validateToken<{ correo: string }>(tokenValue);
      if (!payload) {
        res.status(401).json({ error: 'Invalid token' });
        return;
      }

      const admin = await Administrador.findOne({
        where: { correo: payload.correo },
      });
      if (!admin) {
        res.status(401).json({ error: 'User not found' });
        return;
      }
      if (admin.rol !== 'superAdmin') {
        res.status(401).json({ error: 'User not authorized' });
        return;
      }

      req.body.admin = AdminEntity.fromObject(admin.dataValues);
      next();

    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
      console.log(error);
      next(error);
      return;
    }
  }


  static async validateAdmin(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers['authorization'];
    if (!authorization) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }
    if (!authorization.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Invalid Bearer token' });
      return;
    }
    const tokenValue = authorization.split(' ').at(1) || '';

    try {
      const payload = await JwtAdapter.validateToken<{ correo: string }>(tokenValue);
      if (!payload) {
        res.status(401).json({ error: 'Invalid token' });
        return;
      }

      const admin = await Administrador.findOne({
        where: { correo: payload.correo },
      });
      if (!admin) {
        res.status(401).json({ error: 'User not found' });
        return;
      }
      if (admin.rol !== 'admin') {
        res.status(401).json({ error: 'User not authorized' });
        return;
      }

      req.body.admin = AdminEntity.fromObject(admin.dataValues);
      next();

    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
      console.log(error);
      next(error);
      return;
    }
  }
}