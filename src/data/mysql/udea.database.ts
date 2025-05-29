import { Sequelize } from "sequelize-typescript";
import dotenv from 'dotenv';
dotenv.config({ path: '.env' })
const db = new Sequelize(process.env.DATABASE!, process.env.DB_USERNAME!, process.env.DB_PASSWORD ?? '', {
    host: process.env.BD_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'mysql',
    define: {
        timestamps: true
    },
    pool: {
        max: 5,//maximo de conexiones
        min: 0,//minimo de conexxion
        acquire: 30000,//tiempo antes de marcar un error 
        idle: 10000// tiempo que debe de transmitir  para finalizar una conexion a la bd para liberar espacio o recursos
    },


    models: [__dirname + '/../mysql/models/**'],//es para que busque los modelos en la carpeta models
    logging: false//es para que no muestre los querys en consola
});

export default db;