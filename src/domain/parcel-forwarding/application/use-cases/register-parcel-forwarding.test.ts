import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryParcelForwardingsRepository } from 'test/repositories/in-memory-parcel-forwarding-repository'
import { RegisterParcelForwardingUseCase } from './register-parcel-forwarding'

let inMemoryParcelForwardingsRepository: InMemoryParcelForwardingsRepository
let fakeHasher: FakeHasher

let sut: RegisterParcelForwardingUseCase

describe('Register Parcel Forwarding', () => {
  beforeEach(() => {
    inMemoryParcelForwardingsRepository =
      new InMemoryParcelForwardingsRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterParcelForwardingUseCase(
      inMemoryParcelForwardingsRepository,
      fakeHasher,
    )
  })

  it('should be able to register a new parcel forwarding', async () => {
    const result = await sut.execute({
      name: 'Voabox',
      initials: 'VX',
      email: 'voabox@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      parcelforwarding: inMemoryParcelForwardingsRepository.items[0],
    })
  })

  it('should hash parcel forwarding password upon registration', async () => {
    const result = await sut.execute({
      name: 'Voabox',
      initials: 'VX',
      email: 'voabox@example.com',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryParcelForwardingsRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })
})
