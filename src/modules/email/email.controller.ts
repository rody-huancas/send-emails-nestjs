import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from '@common/dtos';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post("/send")
  sendEmail(@Body() sendEmailDto: SendEmailDto) {
    return this.emailService.sendEmail(sendEmailDto);
  }
}
