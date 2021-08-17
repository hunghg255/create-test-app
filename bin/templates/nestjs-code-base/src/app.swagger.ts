import { DocumentBuilder } from '@nestjs/swagger'

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Todo nestjs document')
  .setDescription('The API description')
  .setVersion('1.0')
  .addTag('Falcon')
  .addBearerAuth()
  .build()
