import { Uploader } from '@/domain/parcel-forwarding/application/storage/uploader'
import { randomUUID } from 'crypto'

interface Upload {
  url: string
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = []

  async upload(): Promise<{ url: string }> {
    const url = randomUUID()

    this.uploads.push({
      url,
    })

    return { url }
  }
}
