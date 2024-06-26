import { Attachment } from '../../enterprise/entities/attachment'

export abstract class AttachmentsRepository {
  abstract create(attachment: Attachment): Promise<void>
  abstract findManyByIds(ids: string[]): Promise<Attachment[]>
}
