import jwt from 'jsonwebtoken';


interface DatosToken {
    id: string;
    nombre: string;
}
const generarId =()=> Math.random().toString(32).substring(2)+ Date.now().toString(32)

const generarJWT= (datos: DatosToken)=>jwt.sign({id: datos.id, nombre:datos.nombre}, process.env.JWT_SECRET!, {expiresIn: '1d'  }) 



export {
    generarId,
    generarJWT
}