import { IsBoolean, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class MailOptions {
  @IsString({ message: 'El remitente debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El remitente es obligatorio' })
  from: string;

  @IsString({ message: 'El destinatario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El destinatario es obligatorio' })
  to: string | string[];

  @IsString({ message: 'El asunto debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El asunto es obligatorio' })
  subject: string;

  @IsString({ message: 'El contenido HTML debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El contenido HTML es obligatorio' })
  html: string;

  @IsOptional()
  @IsString({ message: 'El texto debe ser una cadena de texto' })
  text?: string;
}

export class SmtpAuth {
  @IsString({ message: 'El usuario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El usuario es obligatorio' })
  user: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  pass: string;
}

export class SmtpConfig {
  @IsString({ message: 'El host debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El host es obligatorio' })
  host: string;

  @IsNotEmpty({ message: 'El puerto es obligatorio' })
  @IsNumber({}, { message: 'El puerto debe ser un número' })
  port: number;

  @IsOptional()
  @IsBoolean({ message: 'El campo secure debe ser un booleano' })
  secure?: boolean;

  @IsNotEmpty({ message: 'La autenticación es obligatoria' })
  @IsObject({ message: 'La autenticación debe ser un objeto' })
  auth?: SmtpAuth;
}

export class SendEmailDto {
  @IsObject({ message: 'Las opciones de correo deben ser un objeto' })
  @IsNotEmpty({ message: 'Las opciones de correo son obligatorias' })
  emailOptions: MailOptions;

  @IsObject({ message: 'La configuración SMTP debe ser un objeto' })
  @IsNotEmpty({ message: 'La configuración SMTP es obligatoria' })
  smtpConfig: SmtpConfig;
}
