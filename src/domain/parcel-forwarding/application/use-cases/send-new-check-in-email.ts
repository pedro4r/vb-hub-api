import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'

import { EmailService } from '@/core/email/email-service'
import { EmailContent } from '../../enterprise/entities/value-objects/email-content'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CustomerRepository } from '@/domain/customer/application/repositories/customer-repository'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { CheckInEmailBodyTemplates } from '@/core/email/templates/check-in'
import { ParcelForwardingsRepository } from '../repositories/parcel-forwardings-repository'

interface SendNewCheckInEmailRequest {
  parcelForwardingId: string
  sender: string
  customerId: string
  checkInDetails: string
  weight: number
  attachmentsIds: string[]
  storageURL: string
}

type SendNewCheckInEmailResponse = Either<
  ResourceNotFoundError,
  {
    success: boolean
  }
>
@Injectable()
export class SendNewCheckInEmailUseCase {
  constructor(
    private readonly emailService: EmailService,
    private customerRepository: CustomerRepository,
    private parcelForwardingsRepository: ParcelForwardingsRepository,
    private attachmentsRepository: AttachmentsRepository,
    private checkInEmailBodyTemplates: CheckInEmailBodyTemplates,
  ) {}

  async execute({
    parcelForwardingId,
    sender,
    customerId,
    checkInDetails,
    weight,
    attachmentsIds,
    storageURL,
  }: SendNewCheckInEmailRequest): Promise<SendNewCheckInEmailResponse> {
    const customer = await this.customerRepository.findById(customerId)

    if (!customer) {
      return left(new ResourceNotFoundError('Customer not found'))
    }

    if (customer.parcelForwardingId.toString() !== parcelForwardingId) {
      return left(new NotAllowedError('You are not allowed to send this email'))
    }

    const attachments =
      await this.attachmentsRepository.findManyByIds(attachmentsIds)

    if (!attachments) {
      return left(new ResourceNotFoundError('Attachments not found'))
    }

    const attachmentsUrls = attachments.map((attachment) => {
      return `${storageURL}/${attachment.url}`
    })

    const parcelForwarding =
      await this.parcelForwardingsRepository.findById(parcelForwardingId)

    if (!parcelForwarding) {
      return left(new ResourceNotFoundError('Parcel Forwarding not found'))
    }

    const email = EmailContent.create({
      sender,
      recipient: customer.email,
      subject: 'Novo Check-In de Caixa Recebido',
      body: this.checkInEmailBodyTemplates.newCheckInBody({
        companyName: parcelForwarding.name,
        customerFirstName: customer.firstName,
        checkInDetails,
        weight,
        storageURL,
        attachmentsUrls,
      }),
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
