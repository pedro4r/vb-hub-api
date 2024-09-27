import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from 'test/repositories/in-memory-check-ins-repository'
import { InMemoryCheckInsAttachmentsRepository } from 'test/repositories/in-memory-check-ins-attachments-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { makeCustomer } from 'test/factories/make-customer'

let inMemoryCustomerRepository: InMemoryCustomerRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let inMemoryCheckInsAttachmentsRepository: InMemoryCheckInsAttachmentsRepository

let sut: CheckInUseCase

describe('Check-in', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()

    inMemoryCheckInsAttachmentsRepository =
      new InMemoryCheckInsAttachmentsRepository()
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository(
      inMemoryCheckInsAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryCustomerRepository,
    )
    sut = new CheckInUseCase(inMemoryCheckInsRepository)
  })

  it('should be able to create a check in', async () => {
    const customer = makeCustomer(
      {
        parcelForwardingId: new UniqueEntityID('company-1'),
      },
      new UniqueEntityID('customer-1'),
    )

    const result = await sut.execute({
      parcelForwardingId: customer.parcelForwardingId.toString(),
      customerId: customer.id.toString(),
      status: 1,
      details: 'Package details',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCheckInsRepository.items).toHaveLength(1)
    expect(inMemoryCheckInsRepository.items[0]).toEqual(result.value?.checkin)
    expect(
      inMemoryCheckInsRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(
      inMemoryCheckInsRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })

  it('should persist attachments when check in', async () => {
    const result = await sut.execute({
      parcelForwardingId: 'A1',
      customerId: 'A2',
      status: 1,
      details: 'Package details',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCheckInsAttachmentsRepository.items).toHaveLength(2)
    expect(inMemoryCheckInsAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
      ]),
    )
  })
})
