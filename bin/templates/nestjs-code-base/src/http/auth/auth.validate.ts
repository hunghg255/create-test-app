import { BadRequestException, Injectable } from '@nestjs/common'
import * as Joi from 'joi'

import { SignInDto, SignUpDto } from '@/http/auth/dto'

@Injectable()
export class AuthValidate {
  async signUp(signUpDto: SignUpDto) {
    try {
      const schema = Joi.object({
        email: Joi.string().email().max(127).required(),
        password: Joi.string().min(6).max(127).required(),
        confirmPassword: Joi.string().equal(Joi.ref('password')).required(),
        fullName: Joi.string().min(6).max(127).required(),
      })

      return await schema.validateAsync(signUpDto)
    } catch (error) {
      throw new BadRequestException()
    }
  }

  async signIn(signInDto: SignInDto) {
    try {
      const schema = Joi.object({
        email: Joi.string().email(),
        password: Joi.string().min(6),
      })

      return await schema.validateAsync(signInDto)
    } catch (error) {
      throw new BadRequestException()
    }
  }
}
