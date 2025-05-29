import type { Request, Response } from "express";

import Alumno from "../../data/mysql/models/Alumno";
import Area from "../../data/mysql/models/Area";
import sequelize from "./../../data/mysql/udea.database";

export class AreaController {
  static createArea = async (req: Request, res: Response) => {
    const { nombreArea } = req.body;

    try {
      const area = await Area.create({ nombreArea });
  // Se cambio porque no mandaba un json si no un string
      // Cambia esta línea:
      res.status(201).json({
        message: "Área creada",
        area: {
          idArea: area.id,
          nombreArea: area.nombreArea,
          createdAt: area.createdAt,
          updatedAt: area.updatedAt,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Hubo un error al crear el área", error });
    }
  };

  static getAllAreas = async (req: Request, res: Response) => {
    try {
      const areas = await Area.findAll();
      res.json(areas);
    } catch (error) {
      console.log({ error });
      res.status(500).send("Hubo un error");
    }
  };

  static deleteAreaById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const area = await Area.findByPk(id);
      if (!area) {
        res.send("area no encontrada");
        return;
      }

      await area.destroy();
      // Reiniciar el contador del ID autoincremental

      res.send("area eliminada");
    } catch (error) {
      console.log(error);
      res.send("hubo un error al eliminar el area");
    }
  };

  static updateAreaById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nombreArea } = req.body;

    try {
      const area = await Area.findByPk(id);
      if (!area) {
        res.send("area no encontrada");
        return;
      }

      area.nombreArea = nombreArea;
      await area.save();
      res.send("area actualizada");
    } catch (error) {
      console.log(error);
      res.send("hubo un error al actualizar el area");
    }
  };
}