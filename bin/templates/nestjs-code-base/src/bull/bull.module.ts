import { Module } from '@nestjs/common'
import { BullModule as BullNestModule } from '@nestjs/bull'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    BullNestModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
    }),
  ],
})
export class BullModule {}
