import { EmailContent } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/email-content'

export abstract class EmailService {
  abstract sendEmail(email: EmailContent): Promise<boolean>
}
