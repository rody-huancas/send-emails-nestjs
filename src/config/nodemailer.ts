import { SmtpConfig } from '@common/dtos';
import * as nodemailer from 'nodemailer';

export const createTransporter = (smtpConfig: SmtpConfig) => {
  return nodemailer.createTransport({
    host  : smtpConfig.host,
    port  : smtpConfig.port,
    secure: smtpConfig.secure || false,
    auth  : smtpConfig
      ? {
          user: smtpConfig.auth?.user,
          pass: smtpConfig.auth?.pass,
        }
      :  undefined,
  });
};
