import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { envs } from '@config/envs';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host    : envs.REDIS_HOST,
        port    : envs.REDIS_PORT,
        password: envs.REDIS_PASSWORD || undefined,
      }
    }),
    BullModule.registerQueue({
      name: 'email-queue',
    }),
  ],
  controllers: [EmailController],
  providers  : [EmailService],
})
export class EmailModule {}
