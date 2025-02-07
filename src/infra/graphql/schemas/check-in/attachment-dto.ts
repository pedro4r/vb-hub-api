import { Attachment } from '@/domain/parcel-forwarding/enterprise/entities/attachment'

import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class AttachmentDTO {
  @Field(() => String)
  url: string

  static fromDomain(attachment: Attachment): AttachmentDTO {
    return {
      url: attachment.url,
    }
  }
}
