import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthController } from '@/http/auth/auth.controller'
import { AuthService } from '@/http/auth/auth.service'
import { AuthValidate } from '@/http/auth/auth.validate'
import { UserRepository } from '@/repository'

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  controllers: [AuthController],
  providers: [AuthService, AuthValidate],
})
export class AuthModule {}
