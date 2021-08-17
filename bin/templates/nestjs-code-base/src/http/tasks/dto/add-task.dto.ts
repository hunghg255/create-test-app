import { ApiProperty } from '@nestjs/swagger'

export class AddTaskDto {
  @ApiProperty()
  title: string
}
