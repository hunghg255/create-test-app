import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { S3 } from 'aws-sdk'
import { v4 as uuid } from 'uuid'

@Injectable()
export class S3Service {
  constructor(private readonly configService: ConfigService) {}

  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const s3 = new S3()

    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_S3_PUBLIC_BUCKET'),
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise()

    return uploadResult
  }

  async deletePublicFile(key: string) {
    const s3 = new S3()

    await s3
      .deleteObject({
        Bucket: this.configService.get('AWS_S3_PUBLIC_BUCKET'),
        Key: key,
      })
      .promise()
  }

  async getFile(key: string) {
    const s3 = new S3()

    const file = await s3
      .getObject({
        Bucket: this.configService.get('AWS_S3_PUBLIC_BUCKET'),
        Key: key,
      })
      .promise()

    return file
  }
}
