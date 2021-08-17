import { BadRequestException, Injectable } from '@nestjs/common'
import * as Joi from 'joi'

import { AddTaskDto } from '@/http/tasks/dto'
import { TaskStatus } from '@/enums'

@Injectable()
export class TaskValidate {
  async addTask(addTaskDto: AddTaskDto) {
    try {
      const schema = Joi.object({
        title: Joi.string().max(127).required(),
      })

      return await schema.validateAsync(addTaskDto)
    } catch (error) {
      throw new BadRequestException()
    }
  }

  async getAllTask(params: { limit: number; offset: number }) {
    try {
      const schema = Joi.object({
        limit: Joi.number().required(),
        offset: Joi.number().required(),
      })
      await schema.validateAsync(params)
    } catch (error) {
      throw new BadRequestException()
    }
  }

  async taskId(params: { taskId: number }) {
    try {
      const schema = Joi.object({
        taskId: Joi.number().integer().min(1).required(),
      })
      await schema.validateAsync(params)
    } catch (error) {
      throw new BadRequestException()
    }
  }

  async updateTask(params: { taskId: number; title: string; status: number }) {
    try {
      const schema = Joi.object({
        taskId: Joi.number().integer().min(1).required(),
        title: Joi.string().max(127),
        status: Joi.number().valid(TaskStatus.TODO, TaskStatus.DONE),
      })

      return await schema.validateAsync(params)
    } catch (error) {
      throw new BadRequestException()
    }
  }
}
