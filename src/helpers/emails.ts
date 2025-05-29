import nodemailer from 'nodemailer'




interface datosEmail{
  nombre: string,
  correo: string,
  codigoVerificacion: string
}

const emailRegistro = async (datos: datosEmail)=>{//
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const {nombre, correo, codigoVerificacion}= datos

      //enviar el email

      await transport.sendMail({
        from: 'BienesRaices.com',
        to: correo,
        subject: 'Confirma tu cuenta en Biblioteca_Udea.com',
        text: 'Confirma tu cuenta en Biblioteca_Udea',
        html: `
          <p>Hola ${nombre},</p>
          <p>Gracias por registrarte en <strong>Biblioteca_UDEA</strong>. Tu cuenta está casi lista.</p>
          <p>Para activarla, por favor confirma tu cuenta haciendo clic en el siguiente enlace:</p>
          <p>
            <a href="${process.env.FRONTENT_URL}/confirmar/${codigoVerificacion}">
              Confirmar cuenta
            </a>
          </p>
          <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje.</p>
        `
      });
      
}



const emailOlvidePassword = async (datos : datosEmail)=>{//
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number( process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const {nombre, correo, codigoVerificacion}= datos

    //enviar el email

    await transport.sendMail({
        from: 'BienesRaices.com',
        to: correo,
        subject: 'restablece tu password en bibliotecaUDEA.com', //asunto
        text: 'restablece tu password en bibliotecaUdea.com',   //es lo mismo 
        html: `<p> Hola ${nombre} has solicitado restablecer tu password en bibliotecaUdea </p>
        <p>sigue el siguiente enlace para generar un password nuevo:
      <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${codigoVerificacion}">restablecer password</a>      <!--      url de local-->
       <!--  <a href="${process.env.BACKEND_URL}/auth/olvide-password/${codigoVerificacion}">restablecer password</a>                                      url de hosting-->
        </p>

        <p>Si tu no solicitaste el cambio de password  puedes ignorar el mensaje</p>
        `
    })
}
export{
    emailRegistro,
    emailOlvidePassword
}