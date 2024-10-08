import { InMemoryParcelForwardingsRepository } from 'test/repositories/in-memory-parcel-forwarding-repository'
import { makeParcelForwarding } from 'test/factories/make-parcel-forwarding'
import { CreatePasswordResetUrlUseCase } from './create-password-reset-url'
import { FakeResetPasswordToken } from 'test/cryptography/fake-reset-password-token-url-generator'

let inMemoryParcelForwardingsRepository: InMemoryParcelForwardingsRepository
let resetPasswordTokenUrlGenerator: FakeResetPasswordToken

let sut: CreatePasswordResetUrlUseCase

describe('Create Password Reset URL', () => {
  beforeEach(() => {
    inMemoryParcelForwardingsRepository =
      new InMemoryParcelForwardingsRepository()

    resetPasswordTokenUrlGenerator = new FakeResetPasswordToken()

    sut = new CreatePasswordResetUrlUseCase(
      inMemoryParcelForwardingsRepository,
      resetPasswordTokenUrlGenerator,
    )
  })

  it('should create password reset URL', async () => {
    const parcelforwarding = makeParcelForwarding({
      email: 'johndoe@example.com',
      password: '123456',
    })

    inMemoryParcelForwardingsRepository.items.push(parcelforwarding)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      domainName: 'http://localhost:3000',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      resetPasswordTokenUrl: expect.any(String),
    })
  })
})
