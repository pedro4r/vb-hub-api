import { WatchedList } from '@/core/entities/watched-list'
import { CheckInAttachment } from './check-in-attachment'

export class CheckInAttachmentList extends WatchedList<CheckInAttachment> {
  compareItems(a: CheckInAttachment, b: CheckInAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
