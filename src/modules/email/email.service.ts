import { Queue } from 'bull';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { SendEmailDto } from '@common/dtos';

@Injectable()
export class EmailService {
  constructor(
    @InjectQueue("email-queue") private readonly emailQueue: Queue,
  ) {}

  sendEmail(sendEmailDto: SendEmailDto) {
    const { smtpConfig, emailOptions } = sendEmailDto;

    try {
      this.emailQueue.add('send-email', { smtpConfig, emailOptions }, {
        attempts: 3,
        backoff : {
          type : 'exponential',
          delay: 5000,
        },
      });

      return { message: 'Correo enviado correctamente.' };
    } catch (error) {
      throw new Error(`Error al enviar el email desde el servicio: ${error.message}`);
    }
  }
}
