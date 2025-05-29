import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import { AdminRoutes } from './routes/Administrador/AdminstradorRouter';
import AuthAlumnoRoutes from './routes/AuthAlumno/AuthAlumnoRoutes';
import AlumnoUserRoutes from './routes/AlumnoUser/AlumnoUserRoutes';
import SemestreRoutes from './routes/Semestre/SemestreRouter';
import MateriaRoutes from './routes/Materia/MateriaRoutes';
import BookRoutes from './routes/Book/BookRoutes';
import AreaRoutes from './routes/Area/AreaRouter';
import MatriculaRoutes from './routes/Matricula/MatriculaRouter';

import { errorHandler } from './middleware/errorHandler';
import { corsConfig } from './config/cors';

dotenv.config();

const app = express();

// Middlewares
app.use(cors(corsConfig));
app.use(express.json()); // habilita el body parser para JSON
app.use(express.urlencoded({ extended: true })); // habilita el body parser para formularios
// Logger para mostrar todas las solicitudes
app.use(morgan('dev'))  // <--- Esto imprimirá info de cada request en la terminal

// Servir imágenes desde /uploads/portadas
app.use('/portadas', express.static(path.join(__dirname, '../uploads/portadas')));

app.use('/libros', express.static(path.join(__dirname, '../uploads/libros')));


// Rutas
app.use('/api/alumno', AlumnoUserRoutes);
app.use('/api/auth/alumnos', AuthAlumnoRoutes);
app.use('/api/books', BookRoutes);
app.use('/api/area', AreaRoutes);
app.use('/api/matricula', MatriculaRoutes);
app.use('/api/administrador', AdminRoutes.routes);
app.use('/api/semestre', SemestreRoutes);
app.use('/api/materias', MateriaRoutes);

// Middleware de errores
app.use(errorHandler);

export default app;