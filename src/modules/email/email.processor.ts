import * as sanitizeHtml from 'sanitize-html';
import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { SendEmailDto } from '@common/dtos';
import { createTransporter } from '@config/nodemailer';

@Processor('email-queue')
export class EmailProcessor {
  @Process('send-email')
  async handleSendEmail(job: Job<SendEmailDto>) {
    const { smtpConfig, emailOptions } = job.data;

    let sanitizedHtml: string = sanitizeHtml(emailOptions.html);

    const transporter = createTransporter(smtpConfig);

    try {
      await transporter.sendMail({ ...emailOptions, html: sanitizedHtml });
    } catch (error) {
      throw new Error(`Error al enviar el correo desde el procesador de email: ${error.message}`);
    }
  }
}
