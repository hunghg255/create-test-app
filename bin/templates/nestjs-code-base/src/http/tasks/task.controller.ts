import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Request, Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'

import { AddTaskDto, UpdateTaskDto } from '@/http/tasks/dto'
import { TaskService } from '@/http/tasks/task.service'
import { TaskValidate } from '@/http/tasks/task.validate'
import { User } from '@/entities'
import { Public } from '@/decorator'

@ApiTags('Task')
@ApiBearerAuth()
@Controller('tasks')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly taskValidate: TaskValidate,
  ) {}

  @HttpCode(201)
  @Post()
  async addTask(@Req() req: Request, @Body() addTaskDto: AddTaskDto) {
    const user = req.user as User

    await this.taskValidate.addTask(addTaskDto)

    return this.taskService.addtask(user.id, addTaskDto)
  }

  @HttpCode(200)
  @Get()
  async getAllTasks(
    @Req() req: Request,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    const { id: userId } = req.user as User
    await this.taskValidate.getAllTask({ limit, offset })

    return this.taskService.getAllTask(userId, limit, offset)
  }

  @HttpCode(200)
  @Get('/:taskId')
  async getTask(@Req() req: Request, @Param('taskId') taskId: number) {
    const { id: userId } = req.user as User

    await this.taskValidate.taskId({ taskId })

    return this.taskService.getTask(userId, taskId)
  }

  @HttpCode(204)
  @Delete('/:taskId')
  async removeTask(@Req() req: Request, @Param('taskId') taskId: number) {
    const { id: userId } = req.user as User

    await this.taskValidate.taskId({ taskId })

    return this.taskService.removeTask(userId, taskId)
  }

  @HttpCode(204)
  @Put('/:taskId')
  async updateTask(
    @Req() req: Request,
    @Body() updateTaskDto: UpdateTaskDto,
    @Param('taskId') taskId: number,
  ) {
    const { id: userId } = req.user as User

    await this.taskValidate.updateTask({ taskId, ...updateTaskDto })

    await this.taskService.updateTask({ userId, taskId, ...updateTaskDto })
  }

  @Public()
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.taskService.uploadFile(file.buffer, file.originalname)
  }

  @Public()
  @Get('/file/:key')
  async getFile(@Param('key') key: string) {
    return await this.taskService.getFile(key)
  }

  @Public()
  @Delete('/file/:key')
  async deleteFile(@Param('key') key: string) {
    return await this.taskService.deleteFile(key)
  }

  @Public()
  @Post('/mail')
  async sendMail() {
    return await this.taskService.sendMail()
  }
}
