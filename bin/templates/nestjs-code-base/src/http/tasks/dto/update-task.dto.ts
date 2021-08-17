import { ApiProperty } from '@nestjs/swagger'

export class UpdateTaskDto {
  @ApiProperty()
  title: string

  @ApiProperty()
  status: number
}
