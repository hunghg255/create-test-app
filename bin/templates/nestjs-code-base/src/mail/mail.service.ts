import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'

@Injectable()
export class MailService {
  constructor(@InjectQueue('mail') private readonly mailQueue: Queue) {}

  async sendMail() {
    await this.mailQueue.add('send mail', {
      to: 'hieu300199@gmail.com',
      subject: 'Mail test',
      template: './test',
      context: {
        name: 'Hieu beo',
      },
    })
  }
}
