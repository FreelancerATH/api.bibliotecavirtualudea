
import db from './data/mysql/udea.database';
import server from './server';
import colors from 'colors';
const port = process.env.PORT || 4000;

//
//connectDB()

const startServer = async () => {
    try {
      await db.authenticate();
      db.sync()//generar la tabla creanla si no existe
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  };
  startServer();

server.listen(port, ()=>{
    console.log(colors.cyan.bold(`REST API funcionando en el puerto ${port}`))
})

