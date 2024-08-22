import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { VerifyTokenUseCase } from './verify-token'
import { FakeAuthService } from 'test/cryptography/fake-auth-service'

let verifyToken: FakeAuthService

let sut: VerifyTokenUseCase

describe('Verify Token', () => {
  beforeEach(() => {
    verifyToken = new FakeAuthService()

    sut = new VerifyTokenUseCase(verifyToken)
  })

  it('should verify token', async () => {
    const result = await sut.execute({
      token: 'valid_token',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      status: 'authenticated',
    })

    const result2 = await sut.execute({
      token: 'vali',
    })

    expect(result2.isLeft()).toBe(true)
    expect(result2.value).toBeInstanceOf(WrongCredentialsError)
  })
})
