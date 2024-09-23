import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { EmailContent } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/email-content'
import { EmailService } from '@/core/email/email-service'

@Injectable()
export class NestMailerEmailService extends EmailService {
  constructor(private readonly mailerService: MailerService) {
    super()
  }

  async sendEmail(email: EmailContent): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: email.recipient,
        from: email.sender,
        subject: email.subject,
        html: email.body,
      })
      return true
    } catch (error) {
      console.error('Error sending email', error)
      return false
    }
  }
}