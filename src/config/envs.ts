import 'dotenv/config';
import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.string().min(1, 'Puerto es requerido').transform(Number),
}).passthrough();

const envParsed = envSchema.safeParse(process.env);

if (!envParsed.success) {
  console.error('❌ Configuración de entorno inválida:', envParsed.error.format());
  throw new Error('Configuración de entorno inválida');
}

export const envs = {
  PORT: envParsed.data.PORT,
}
