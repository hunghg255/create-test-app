import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { getConnection } from 'typeorm'

import { TaskRepository } from '@/repository'
import { TaskStatus } from '@/enums'
import { Task, User } from '@/entities'
import { S3Service } from '@/s3'
import { MailService } from '@/mail'

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepo: TaskRepository,
    private readonly s3Service: S3Service,
    private readonly mailService: MailService,
  ) {}

  async addtask(userId: number, { title }) {
    const connection = getConnection()
    const queryRunner = connection.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      await queryRunner.manager.insert(Task, {
        userId,
        title,
        status: TaskStatus.TODO,
      })

      await queryRunner.manager.increment(User, { id: userId }, 'taskCount', 1)

      await queryRunner.commitTransaction()
    } catch (error) {
      await queryRunner.rollbackTransaction()

      throw new InternalServerErrorException()
    } finally {
      await queryRunner.release()
    }
  }

  async getAllTask(userId: number, limit: number, offset: number) {
    const [result, total] = await this.taskRepo.findAndCount({
      where: { userId },
      skip: offset,
      take: limit,
      order: { id: 'DESC' },
    })

    return { tasks: result, total, limit, offset }
  }

  async getTask(userId: number, taskId: number) {
    const task = await this.taskRepo.findOne({ id: taskId, userId })

    if (!task) {
      throw new HttpException(
        {
          statusCode: 404,
          message: 'Task does not exist',
        },
        HttpStatus.NOT_FOUND,
      )
    }

    return task
  }

  async removeTask(userId: number, taskId: number) {
    const task = await this.taskRepo.findOne({ id: taskId, userId })

    if (!task) {
      throw new HttpException(
        {
          statusCode: 404,
          message: 'Task does not exist',
        },
        HttpStatus.NOT_FOUND,
      )
    }

    const connection = getConnection()
    const queryRunner = connection.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      await queryRunner.manager.delete(Task, taskId)

      await queryRunner.manager.decrement(User, { id: userId }, 'taskCount', 1)

      await queryRunner.commitTransaction()
    } catch (error) {
      await queryRunner.rollbackTransaction()

      throw new InternalServerErrorException()
    } finally {
      await queryRunner.release()
    }
  }

  async updateTask({ userId, taskId, title, status }) {
    const task = await this.taskRepo.findOne({ id: taskId, userId })

    if (!task) {
      throw new HttpException(
        {
          statusCode: 404,
          message: 'Task does not exist',
        },
        HttpStatus.NOT_FOUND,
      )
    }

    try {
      await this.taskRepo.update(taskId, {
        title: title || task.title,
        status: status || task.status,
      })
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  async uploadFile(dataBuffer: Buffer, filename: string) {
    return await this.s3Service.uploadPublicFile(dataBuffer, filename)
  }

  async getFile(key: string) {
    return await this.s3Service.getFile(key)
  }

  async deleteFile(key: string) {
    return await this.s3Service.deletePublicFile(key)
  }

  async sendMail() {
    await this.mailService.sendMail()
  }
}
