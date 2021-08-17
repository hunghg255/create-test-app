import { ExtractJwt, Strategy } from 'passport-jwt'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'

import { UserPayloadType } from '@/types'
import { UserRepository } from '@/repository'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userRepo: UserRepository,
    protected configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('SECRET_JWT_KEY'),
    })
  }

  async validate(payload: UserPayloadType) {
    const { id: userId } = payload

    const user = this.userRepo.findOne(userId)

    if (!user) {
      throw new HttpException(
        {
          statusCode: 401,
          message: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      )
    }

    return user
  }
}
