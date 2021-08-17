import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer'
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'

@Processor('mail')
export class MailProcessor {
  private readonly logger = new Logger(MailProcessor.name)

  constructor(private readonly mailerService: MailerService) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(`Processing job ${job.id} of type ${job.name}.`)
  }

  @OnQueueCompleted()
  onComplete(job: Job) {
    this.logger.log(`Completed job ${job.id} of type ${job.name}.`)
  }

  @OnQueueFailed()
  onError(job: Job<any>, error: any) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    )
  }

  @Process('send mail')
  async handleSendMail(job: Job<ISendMailOptions>) {
    try {
      return await this.mailerService.sendMail(job.data)
    } catch (error) {
      throw new Error(error)
    }
  }
}
