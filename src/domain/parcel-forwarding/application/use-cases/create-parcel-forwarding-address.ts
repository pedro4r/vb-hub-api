import { Either, right } from '@/core/either'
import { ParcelForwardingAddress } from '../../enterprise/entities/forwarding-address'
import { ParcelForwardingAddressesRepository } from '../repositories/forwarding-addresses-repository'
import { Address } from '@/core/value-objects/address'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface CreateParcelForwardingAddressUseCaseRequest {
  parcelForwardingId: string
  address: string
  complement?: string | null
  city: string
  state: string
  zipcode: string
  country: string
}

type CreateParcelForwardingAddressUseCaseResponse = Either<
  null,
  {
    parcelForwardingAddress: ParcelForwardingAddress
  }
>

export class CreateParcelForwardingAddressUseCase {
  constructor(
    private parcelForwardingAddressesRepository: ParcelForwardingAddressesRepository,
  ) {}

  async execute({
    parcelForwardingId,
    address,
    complement,
    city,
    state,
    zipcode,
    country,
  }: CreateParcelForwardingAddressUseCaseRequest): Promise<CreateParcelForwardingAddressUseCaseResponse> {
    const addressInfo = new Address({
      address,
      complement,
      city,
      state,
      zipcode,
      country,
    })

    const parcelForwardingAddress = ParcelForwardingAddress.create({
      parcelForwardingId: new UniqueEntityID(parcelForwardingId),
      address: addressInfo,
    })

    await this.parcelForwardingAddressesRepository.create(
      parcelForwardingAddress,
    )

    return right({
      parcelForwardingAddress,
    })
  }
}
