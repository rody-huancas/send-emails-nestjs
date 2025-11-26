import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  sendEmail() {
    return "Email sent successfully!";
  }
}
