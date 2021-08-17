import { ApiProperty } from '@nestjs/swagger'

export class SignUpDto {
  @ApiProperty()
  email: string

  @ApiProperty()
  password: string

  @ApiProperty()
  confirmPassword: string

  @ApiProperty()
  fullName: string
}
