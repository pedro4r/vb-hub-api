import { FakeEmailSender } from 'test/email/fake-email-sender'
import { SendNewCheckInEmailUseCase } from './send-new-check-in-email'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeCustomer } from 'test/factories/make-customer'
import { makeAttachment } from 'test/factories/make-attachment'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { CheckInEmailBodyTemplates } from '@/core/email/templates/check-in'
import { InMemoryParcelForwardingsRepository } from 'test/repositories/in-memory-parcel-forwarding-repository'
import { makeParcelForwarding } from 'test/factories/make-parcel-forwarding'

let inMemoryParcelForwardingRepository: InMemoryParcelForwardingsRepository
let inMemoryCustomerRepository: InMemoryCustomerRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository

let checkInEmailBodyTemplates: CheckInEmailBodyTemplates
let emailSender: FakeEmailSender

let sut: SendNewCheckInEmailUseCase

describe('Send New Check-in Email', () => {
  beforeEach(() => {
    inMemoryParcelForwardingRepository =
      new InMemoryParcelForwardingsRepository()
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    emailSender = new FakeEmailSender()

    checkInEmailBodyTemplates = new CheckInEmailBodyTemplates()

    sut = new SendNewCheckInEmailUseCase(
      emailSender,
      inMemoryCustomerRepository,
      inMemoryParcelForwardingRepository,
      inMemoryAttachmentsRepository,
      checkInEmailBodyTemplates,
    )
  })

  it('should send new check-in email', async () => {
    const customer = makeCustomer(
      {
        parcelForwardingId: new UniqueEntityID('company-1'),
      },
      new UniqueEntityID('customer-1'),
    )
    await inMemoryCustomerRepository.create(customer)

    const parcelForwarding = makeParcelForwarding(
      {},
      new UniqueEntityID('company-1'),
    )

    await inMemoryParcelForwardingRepository.create(parcelForwarding)

    const attachment1 = makeAttachment({}, new UniqueEntityID('attachment-1'))
    await inMemoryAttachmentsRepository.create(attachment1)

    const attachment2 = makeAttachment({}, new UniqueEntityID('attachment-1'))
    await inMemoryAttachmentsRepository.create(attachment2)

    const result = await sut.execute({
      parcelForwardingId: customer.parcelForwardingId.toString(),
      sender: 'johndoe@example.com',
      customerId: customer.id.toString(),
      checkInDetails: 'Package details',
      weight: 10,
      attachmentsIds: [attachment1.id.toString(), attachment2.id.toString()],
      storageURL: 'http://localhost:3000/storage',
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not send new check-in email', async () => {
    const customer = makeCustomer(
      {
        parcelForwardingId: new UniqueEntityID('company-1'),
      },
      new UniqueEntityID('customer-1'),
    )

    await inMemoryCustomerRepository.create(customer)

    const attachment1 = makeAttachment({}, new UniqueEntityID('attachment-1'))
    await inMemoryAttachmentsRepository.create(attachment1)

    const attachment2 = makeAttachment({}, new UniqueEntityID('attachment-1'))
    await inMemoryAttachmentsRepository.create(attachment2)

    const result = await sut.execute({
      parcelForwardingId: 'company-2',
      sender: 'johndoe@example.com',
      customerId: customer.id.toString(),
      checkInDetails: 'Package details',
      weight: 10,
      attachmentsIds: [attachment1.id.toString(), attachment2.id.toString()],
      storageURL: 'http://localhost:3000/storage',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
