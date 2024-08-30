import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'

import { EmailService } from '@/core/email/email-service'
import { EmailContent } from '../../enterprise/entities/value-objects/email-content'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface SendResetPasswordEmailRequest {
  sender: string
  recipient: string
  tokenUrl: string
}

type SendResetPasswordEmailResponse = Either<
  ResourceNotFoundError,
  {
    success: boolean
  }
>
@Injectable()
export class SendResetPasswordEmailUseCase {
  constructor(private readonly emailService: EmailService) {}

  async execute({
    sender,
    recipient,
    tokenUrl,
  }: SendResetPasswordEmailRequest): Promise<SendResetPasswordEmailResponse> {
    const email = EmailContent.create({
      sender,
      recipient,
      subject: 'Reset Your Password',
      body: `
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <p><a href="${tokenUrl}">Reset Password</a></p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    })

    const response = await this.emailService.sendEmail(email)

    if (!response) {
      return left(new ResourceNotFoundError('Email not sent'))
    }

    return right({
      success: true,
    })
  }
}
