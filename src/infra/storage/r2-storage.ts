import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { EnvService } from '../env/env.service'
import { randomUUID } from 'node:crypto'
import {
  UploadParams,
  Uploader,
} from '@/domain/parcel-forwarding/application/storage/uploader'

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client

  constructor(private envService: EnvService) {
    const accountId = envService.get('CLOUDFLARE_ACCOUNT_ID')
    console.log('Initializing S3Client with accountId:', accountId)

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: envService.get('CLOUDFLARE_ACCESS_KEY_ID'),
        secretAccessKey: envService.get('CLOUDFLARE_SECRET_ACCESS_KEY'),
      },
    })

    console.log('S3Client initialized successfully.')
  }

  async upload({ fileType, body }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID()
    const extension = fileType.split('/')[1]
    const uniqueFileName = `${uploadId}.${extension}`

    console.log(
      `Uploading file with name: ${uniqueFileName} and type: ${fileType}`,
    )

    try {
      const start = Date.now()
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.envService.get('CLOUDFLARE_BUCKET_NAME'),
          Key: uniqueFileName,
          ContentType: fileType,
          Body: body,
        }),
      )
      const end = Date.now()
      console.log(`Upload completed in ${end - start}ms`)

      return {
        url: uniqueFileName,
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }
}
