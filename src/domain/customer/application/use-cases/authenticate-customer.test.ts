import { FakeHasher } from 'test/cryptography/fake-hasher'
import { AuthenticateCustomerUseCase } from './authenticate-customer'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeCustomer } from 'test/factories/make-customer'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'

let inMemoryCustomerRepository: InMemoryCustomerRepository
let fakeHasher: FakeHasher
let encrypter: FakeEncrypter

let sut: AuthenticateCustomerUseCase

describe('Authenticate Parcel Forwarding', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()

    sut = new AuthenticateCustomerUseCase(
      inMemoryCustomerRepository,
      fakeHasher,
      encrypter,
    )
  })

  it('should be able to authenticate a customer', async () => {
    const customer = makeCustomer({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryCustomerRepository.items.push(customer)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
