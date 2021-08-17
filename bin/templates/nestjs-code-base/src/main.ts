import { NestFactory, Reflector } from '@nestjs/core'
import * as morgan from 'morgan'
import { json } from 'body-parser'
import { SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { config } from 'aws-sdk'

import { AppModule } from '@/app.module'
import { swaggerConfig } from '@/app.swagger'
import { JwtGuard } from '@/jwt'
import { SocketIoAdapter } from '@/adapter'

// eslint-disable-next-line prettier/prettier
(async () => {
  const app = await NestFactory.create(AppModule)
  const reflector = app.get(Reflector)

  app.enableCors()
  app.use(morgan('dev'))
  app.use(json({ limit: '50mb' }))
  app.useGlobalGuards(new JwtGuard(reflector))
  app.useWebSocketAdapter(new SocketIoAdapter(app, true))

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('document', app, document)

  const configService = app.get(ConfigService)
  const PORT = configService.get<number>('APP_PORT')
  const configS3 = {
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
    region: configService.get('AWS_DEFAULT_REGION'),
  }

  config.update(
    configService.get('APP_ENV') === 'local'
      ? {
          ...configS3,
          s3: {
            endpoint: configService.get('AWS_S3_END_POINT'),
          },
        }
      : configS3,
  )

  await app.listen(PORT || 3000)
})()
