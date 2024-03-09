import { Either, left, right } from '@/core/either'
import { ParcelForwardingsRepository } from '../repositories/parcel-forwardings-repository'
import { ParcelForwarding } from '../../enterprise/entities/parcel-forwarding'
import { HashGenerator } from '@/core/cryptography/hash-generator'
import { UserAlreadyExistsError } from '@/core/errors/errors/user-already-exists-error'

interface RegisterParcelForwardingUseCaseRequest {
  name: string
  initials: string
  email: string
  password: string
}

type RegisterParcelForwardingUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    parcelforwarding: ParcelForwarding
  }
>

export class RegisterParcelForwardingUseCase {
  constructor(
    private parcelforwardingsRepository: ParcelForwardingsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    initials,
    email,
    password,
  }: RegisterParcelForwardingUseCaseRequest): Promise<RegisterParcelForwardingUseCaseResponse> {
    const parcelforwardingWithSameEmail =
      await this.parcelforwardingsRepository.findByEmail(email)

    if (parcelforwardingWithSameEmail) {
      return left(new UserAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const parcelforwarding = ParcelForwarding.create({
      name,
      initials,
      email,
      password: hashedPassword,
    })

    await this.parcelforwardingsRepository.create(parcelforwarding)

    return right({
      parcelforwarding,
    })
  }
}
