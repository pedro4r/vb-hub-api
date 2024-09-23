import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryParcelForwardingsRepository } from 'test/repositories/in-memory-parcel-forwarding-repository'
import { makeParcelForwarding } from 'test/factories/make-parcel-forwarding'
import { ResetParcelForwardingPasswordUseCase } from './reset-password'

let inMemoryParcelForwardingsRepository: InMemoryParcelForwardingsRepository
let fakeHasher: FakeHasher

let sut: ResetParcelForwardingPasswordUseCase

describe('Authenticate Parcel Forwarding', () => {
  beforeEach(() => {
    inMemoryParcelForwardingsRepository =
      new InMemoryParcelForwardingsRepository()
    fakeHasher = new FakeHasher()

    sut = new ResetParcelForwardingPasswordUseCase(
      inMemoryParcelForwardingsRepository,
      fakeHasher,
    )
  })

  it('should be able to reset parcelforwarding password', async () => {
    const parcelforwarding = makeParcelForwarding({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('1234567'),
    })

    inMemoryParcelForwardingsRepository.items.push(parcelforwarding)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      newPassword: '654321',
    })

    expect(result.isRight()).toBe(true)
  })

  // it('should not be able to reset parcelforwarding password', async () => {
  //   const parcelforwarding = makeParcelForwarding({
  //     email: 'johndoe@example.com',
  //     password: await fakeHasher.hash('123456'),
  //   })

  //   inMemoryParcelForwardingsRepository.items.push(parcelforwarding)

  //   const result = await sut.execute({
  //     email: 'fake.johndoe@example.com',
  //     newPassword: await fakeHasher.hash('123456'),
  //   })

  //   expect(result.isLeft()).toBe(true)
  // })
})
