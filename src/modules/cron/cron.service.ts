import { SendEmailDto } from '@common/dtos';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { envs } from '@config/envs';
import { EmailService } from '@modules/email/email.service';

@Injectable()
export class CronService {
  private readonly logger: Logger = new Logger(CronService.name);

  constructor(private readonly emailService: EmailService) {}

  @Cron(CronExpression.EVERY_MINUTE, {
    name: 'text-email',
  })
  handleEmail() {
    const email: SendEmailDto = {
      emailOptions: {
        from   : envs.EMAIL_FROM,
        to     : envs.EMAIL_TO,
        subject: `Correo de prueba enviado a las ${new Date().toLocaleTimeString()}`,
        html   : this.getEmailTemplate(),
      },
      smtpConfig: {
        host  : envs.SMTP_HOST,
        port  : envs.SMTP_PORT,
        secure: envs.SMTP_SECURE,
        auth  : {
          user: envs.SMTP_USER,
          pass: envs.SMTP_PASS,
        },
      },
    };

    try {
      this.emailService.sendEmail(email);
      this.logger.log('Correo enviado correctamente');
    } catch (error) {
      this.logger.error('Error al enviar el correo', error);
    }
  }

  private getEmailTemplate(): string {
    return `<!DOCTYPE html>
            <html lang="es">

            <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Correo</title>
            </head>

            <body style="
                margin: 0;
                padding: 0;
                background: #f4f6f8;
                font-family: Calibri, Helvetica, Arial, sans-serif;
                color: #333;
                ">
                <div style="
                        max-width: 600px;
                        margin: 40px auto;
                        background: #ffffff;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
                        border: 1px solid #e6e9ef;
                    ">
                    <div style="
                        background: linear-gradient(135deg, #0a60ff, #0d8bd3);
                        padding: 30px;
                        text-align: center;
                        color: #ffffff;
                        ">
                    <h1 style="
                            margin: 0;
                            font-size: 26px;
                            font-weight: 600;
                            letter-spacing: 0.5px;
                            font-family: Calibri, Helvetica, Arial, sans-serif;
                        ">
                        Notificación del Sistema
                    </h1>
                    </div>
                    <div style="
                        padding: 32px;
                        line-height: 1.7;
                        font-size: 16px;
                        font-family: Calibri, Helvetica, Arial, sans-serif;
                        ">
                    <p style="margin: 0 0 16px 0">Hola,</p>
                    <p style="margin: 0 0 16px 0">
                        Este es un <strong>correo de prueba</strong> generado desde la API
                        para validar el envío mediante Postman.
                    </p>
                    <p style="margin: 0 0 16px 0">
                        Puedes modificar libremente el contenido, colores o estructura.
                    </p>
                    <a href="#" style="
                            display: inline-block;
                            margin-top: 20px;
                            padding: 12px 22px;
                            background: #0a60ff;
                            color: #fff;
                            border-radius: 8px;
                            font-size: 16px;
                            text-decoration: none;
                            font-weight: 500;
                            box-shadow: 0 3px 8px rgba(10, 96, 255, 0.3);
                            font-family: Calibri, Helvetica, Arial, sans-serif;
                        ">
                        Ir al Sistema
                    </a>
                    <p style="margin-top: 25px">
                        Si no solicitaste este mensaje, puedes ignorarlo.
                    </p>
                    </div>

                    <div style="
                        text-align: center;
                        padding: 18px;
                        font-size: 13px;
                        color: #7a7a7a;
                        background: #f4f6f8;
                        font-family: Calibri, Helvetica, Arial, sans-serif;
                        ">
                    © ${new Date().getFullYear()} · Sistema de Notificaciones | Desarrollado
                    por
                    <a href="https://github.com/rody-huancas" target="_blank"
                        style="color: #7a7a7a; text-decoration: none; font-weight: 500">Rody Huancas</a>
                    </div>
                </div>
            </body>
            </html>
    `;
  }
}
