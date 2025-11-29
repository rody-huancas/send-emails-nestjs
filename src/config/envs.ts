import 'dotenv/config';
import { z } from 'zod';

export const envSchema = z.object({
  PORT          : z.string().min(1, 'Puerto es requerido').transform(Number),
  REDIS_HOST    : z.string().min(1, 'Host de Redis es requerido'),
  REDIS_PORT    : z.string().min(1, 'Puerto de Redis es requerido').transform(Number),
  REDIS_PASSWORD: z.string().optional(),
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
}
