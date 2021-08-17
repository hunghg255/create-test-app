import { EntityRepository, Repository } from 'typeorm'

import { Task } from '@/entities'

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {}
