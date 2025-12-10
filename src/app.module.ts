import { Module } from '@nestjs/common';
import { CronModule } from './modules/cron/cron.module';
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [EmailModule, CronModule],
})
export class AppModule {}
