import { EntityRepository, Repository } from 'typeorm'

import { User } from '@/entities'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async hasEmail(email: string) {
    const existUser = await this.findOne({ email })

    if (!existUser) return false

    return true
  }
}
