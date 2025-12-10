import 'dotenv/config';
import { z } from 'zod';

export const envSchema = z.object({
  PORT          : z.string().min(1, 'Puerto es requerido').transform(Number),
  REDIS_HOST    : z.string().min(1, 'Host de Redis es requerido'),
  REDIS_PORT    : z.string().min(1, 'Puerto de Redis es requerido').transform(Number),
  REDIS_PASSWORD: z.string().optional(),
  
  // Email/SMTP configuration
  SMTP_HOST     : z.string().min(1, 'Host SMTP es requerido'),
  SMTP_PORT     : z.string().min(1, 'Puerto SMTP es requerido').transform(Number),
  SMTP_SECURE   : z.string().transform(val => val === 'true'),
  SMTP_USER     : z.string().min(1, 'Usuario SMTP es requerido'),
  SMTP_PASS     : z.string().min(1, 'Contraseña SMTP es requerida'),
  EMAIL_FROM    : z.string().email('Email remitente inválido'),
  EMAIL_TO      : z.string().email('Email destinatario inválido'),
}).passthrough();

const envParsed = envSchema.safeParse(process.env);

if (!envParsed.success) {
  console.error('❌ Configuración de entorno inválida:', envParsed.error.format());
  throw new Error('Configuración de entorno inválida');
}

export const envs = {
  PORT          : envParsed.data.PORT,
  REDIS_HOST    : envParsed.data.REDIS_HOST,
  REDIS_PORT    : envParsed.data.REDIS_PORT,
  REDIS_PASSWORD: envParsed.data.REDIS_PASSWORD,
  
  // Email/SMTP
  SMTP_HOST     : envParsed.data.SMTP_HOST,
  SMTP_PORT     : envParsed.data.SMTP_PORT,
  SMTP_SECURE   : envParsed.data.SMTP_SECURE,
  SMTP_USER     : envParsed.data.SMTP_USER,
  SMTP_PASS     : envParsed.data.SMTP_PASS,
  EMAIL_FROM    : envParsed.data.EMAIL_FROM,
  EMAIL_TO      : envParsed.data.EMAIL_TO,
}
