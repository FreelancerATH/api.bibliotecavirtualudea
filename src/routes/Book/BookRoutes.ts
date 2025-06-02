import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { createBook } from '../../controllers/Books/createBook';
import { getBooks } from '../../controllers/Books/getBooks';
import { getBookById } from '../../controllers/Books/getBookById';
import { updateBook } from '../../controllers/Books/updateBook';
import { deleteBook } from '../../controllers/Books/deleteBook';
import { searchBooks } from '../../controllers/Books/searchBooks';
import upload from '../../middleware/upload';

const router = Router();
router.post(
  '/create',
  upload.fields([
    { name: "portada", maxCount: 1 },  // Portada del libro
    { name: "archivo", maxCount: 1 }  // Archivo del libro
  ]),
  (req, res) => {
    // Aquí llamamos al controlador y manejamos la promesa
    createBook(req, res).catch((error) => {
      console.error('Error en la ruta POST /create:', error);
      res.status(500).json({ message: 'Error en el procesamiento de la solicitud', error: error.message });
    });
  }
);



// 🔹 Ruta para obtener todos los libros
router.get('/getBooks', async (req: Request, res: Response): Promise<void> => {
  try {
    await getBooks(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error });
  }
});
// Ruta para obtener un libro por su ID
router.get('/getBooks/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    await getBookById(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error });
  }
});
// Ruta para buscar libros con filtros
router.get('/searchBooks', async (req: Request, res: Response): Promise<void> => {
  try {
    await searchBooks(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error });
  }
});

router.put('/updateBook/:id', upload.fields([
  { name: 'archivo', maxCount: 1 },  // El archivo del libro (PDF o DOCX)
  { name: 'portada', maxCount: 1 }   // La imagen de portada
]), updateBook);

// Ruta para eliminar un libro
router.delete('/deleteBook/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    await deleteBook(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error });
  }
});


export default router;
