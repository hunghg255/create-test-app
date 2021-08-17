import {
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Task } from '@/entities/task.entity'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number

  @Column({
    name: 'full_name',
    type: 'varchar',
    length: 127,
    collation: 'utf8_general_ci',
    nullable: false,
  })
  fullName: string

  @Column({
    name: 'email',
    type: 'varchar',
    length: 127,
    collation: 'latin1_general_ci',
    unique: true,
    nullable: false,
  })
  email: string

  @Column({
    name: 'password',
    type: 'varchar',
    length: 127,
    collation: 'latin1_general_ci',
    nullable: false,
    select: false,
  })
  password: string

  @Column({ name: 'task_count', type: 'tinyint', nullable: false })
  taskCount: number

  @OneToMany(() => Task, (task) => task.user, { cascade: true })
  tasks: Task[]

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date

  @BeforeUpdate()
  updateDates() {
    this.updatedAt = new Date()
  }
}
