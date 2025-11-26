import { Module } from '@nestjs/common';
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [EmailModule],
})
export class AppModule {}
