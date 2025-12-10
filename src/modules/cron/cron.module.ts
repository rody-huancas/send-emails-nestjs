import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { EmailModule } from '@modules/email/email.module';

@Module({
  imports  : [ScheduleModule.forRoot(), EmailModule],
  providers: [CronService],
})
export class CronModule {}
