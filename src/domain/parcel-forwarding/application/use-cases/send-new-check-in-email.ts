import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'

import { EmailService } from '@/core/email/email-service'
import { EmailContent } from '../../enterprise/entities/value-objects/email-content'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CustomerRepository } from '@/domain/customer/application/repositories/customer-repository'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

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
    private attachmentsRepository: AttachmentsRepository,
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

    const attachmentsUrl = attachments.map((attachment) => {
      return `${storageURL}/${attachment.url}`
    })

    const email = EmailContent.create({
      sender,
      recipient: customer.email,
      subject: 'Novo Check-In de Caixa Recebido',
      body: `
        <p>Prezado(a) ${customer.firstName},</p>

        <p>Estamos informando que uma nova caixa foi recebida em nosso hub.</p>

        <p><strong>Detalhes do Check-In:</strong></p>
        <ul>
          <li><strong>Cliente:</strong> ${customer.firstName} ${customer.lastName}</li>
          <li><strong>Descrição:</strong> ${checkInDetails || 'Sem descrição fornecida'}</li>
          <li><strong>Peso:</strong> ${(weight / 1000).toFixed(2)} kg</li>
        </ul>

        <p>As imagens anexadas da caixa recebida estão abaixo:</p>
        
        ${attachmentsUrl
          .map(
            (url) =>
              `<div><img src="${url}" alt="Imagem da caixa" style="max-width: 100%; height: auto;" /></div>`,
          )
          .join('')}
        
        <p>Atenciosamente,</p>
        <p>Sua equipe de logística</p>
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
