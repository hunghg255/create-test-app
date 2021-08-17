import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'
import { DatabaseModule } from '@/database'
import { AuthModule } from '@/http/auth'
import { TaskModule } from '@/http/tasks'
import { BullModule } from '@/bull'
import { AppGateway } from '@/gateways'
import { JwtModule } from '@/jwt'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    JwtModule,
    BullModule,
    AuthModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
