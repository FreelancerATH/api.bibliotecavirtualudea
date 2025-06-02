// src/routes/pdfRoute.ts

import { Router, Request, Response } from 'express';
import { File } from 'megajs';

const router = Router();

router.get('/pdf-from-mega', async (req: Request, res: Response) => {
  const url  = req.query.url as string | undefined;

  if (!url || typeof url !== 'string') {
    res.status(400).json({ message: 'Falta la URL de MEGA en el query (?url=...)' });
  }

  try {
    const file = File.fromURL(url!);

    file.loadAttributes((err) => {
      if (err) {
        console.error('Error al cargar atributos:', err);
        return res.status(500).json({ message: 'Error al acceder al archivo de MEGA.' });
      }

      const stream = file.download({});

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="documento.pdf"');

      stream.pipe(res);

      stream.on('error', (streamErr) => {
        console.error('Error en el stream de MEGA:', streamErr);
        res.status(500).json({ message: 'Error al descargar el archivo desde MEGA.' });
      });
    });
  } catch (error) {
    console.error('Error general:', error);
    res.status(500).json({ message: 'Error procesando la solicitud.' });
  }
});

export default router;
