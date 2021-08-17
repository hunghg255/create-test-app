import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { UserRepository } from '@/repository'

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signIn({ email, password }) {
    const existUser = await this.userRepo.findOne(
      { email },
      { select: ['password'] },
    )

    if (
      !existUser ||
      !(await bcrypt.compare(password || '', existUser.password))
    ) {
      throw new HttpException(
        {
          statusCode: 401,
          message: 'Email or password is incorrect',
        },
        HttpStatus.UNAUTHORIZED,
      )
    }

    return {
      accessToken: this.jwtService.sign({ id: existUser.id }),
      expiresIn: this.configService.get('EXPIRES_IN'),
    }
  }

  async signUp({ email, password, fullName }) {
    if (await this.userRepo.hasEmail(email)) {
      throw new HttpException(
        {
          statusCode: 400,
          message: 'Email already exist',
        },
        HttpStatus.BAD_REQUEST,
      )
    }

    const hashPassword = await bcrypt.hash(
      password,
      +this.configService.get('SALT_ROUNDS'),
    )

    try {
      await this.userRepo.insert({
        email,
        password: hashPassword,
        fullName,
        taskCount: 0,
      })
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }
}
