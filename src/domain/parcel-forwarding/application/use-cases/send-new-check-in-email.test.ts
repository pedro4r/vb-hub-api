import { FakeEmailSender } from 'test/email/fake-email-sender'
import { SendNewCheckInEmailUseCase } from './send-new-check-in-email'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeCustomer } from 'test/factories/make-customer'
import { makeAttachment } from 'test/factories/make-attachment'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryCustomerRepository: InMemoryCustomerRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let emailSender: FakeEmailSender

let sut: SendNewCheckInEmailUseCase

describe('Send Reset Password Url Email', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    emailSender = new FakeEmailSender()

    sut = new SendNewCheckInEmailUseCase(
      emailSender,
      inMemoryCustomerRepository,
      inMemoryAttachmentsRepository,
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
