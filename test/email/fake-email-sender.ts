import { EmailService } from '@/core/email/email-service'
import { EmailContent } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/email-content'

export class FakeEmailSender implements EmailService {
  async sendEmail(email: EmailContent): Promise<boolean> {
    if (email.recipient === 'invalid-email') {
      return false
    }
    return true
  }
}
