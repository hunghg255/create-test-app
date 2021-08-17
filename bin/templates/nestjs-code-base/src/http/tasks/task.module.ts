import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TaskController } from '@/http/tasks/task.controller'
import { TaskService } from '@/http/tasks/task.service'
import { TaskValidate } from '@/http/tasks/task.validate'
import { TaskRepository } from '@/repository'
import { S3Service } from '@/s3'
import { MailModule } from '@/mail'

@Module({
  imports: [TypeOrmModule.forFeature([TaskRepository]), MailModule],
  controllers: [TaskController],
  providers: [TaskService, TaskValidate, S3Service],
})
export class TaskModule {}
