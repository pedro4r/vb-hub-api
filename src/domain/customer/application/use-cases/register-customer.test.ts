import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { RegisterCustomerUseCase } from './register-customer'
import { InMemoryParcelForwardingsRepository } from 'test/repositories/in-memory-parcel-forwarding-repository'
import { makeParcelForwarding } from 'test/factories/make-parcel-forwarding'

let inMemoryParcelForwardingsRepository: InMemoryParcelForwardingsRepository
let inMemoryCustomerRepository: InMemoryCustomerRepository
let fakeHasher: FakeHasher

let sut: RegisterCustomerUseCase

describe('Register Customer', () => {
  beforeEach(() => {
    inMemoryParcelForwardingsRepository =
      new InMemoryParcelForwardingsRepository()
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterCustomerUseCase(
      inMemoryCustomerRepository,
      inMemoryParcelForwardingsRepository,
      fakeHasher,
    )
  })

  it('should be able to register a new customer', async () => {
    const parcelforwarding = makeParcelForwarding({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryParcelForwardingsRepository.items.push(parcelforwarding)

    const result = await sut.execute({
      parcelForwardingId: parcelforwarding.id.toString(),
      firstName: 'Pedro',
      lastName: 'Requiao',
      email: 'pedro@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      customer: inMemoryCustomerRepository.items[0],
    })
  })

  it('should hash customer password upon registration', async () => {
    const parcelforwarding = makeParcelForwarding({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryParcelForwardingsRepository.items.push(parcelforwarding)

    const result = await sut.execute({
      parcelForwardingId: parcelforwarding.id.toString(),
      firstName: 'Pedro',
      lastName: 'Requiao',
      email: 'pedro@example.com',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryCustomerRepository.items[0].password).toEqual(hashedPassword)
  })
})
