import { Either, right } from '@/core/either'
import { ParcelForwardingAddress } from '../../enterprise/entities/forwarding-address'
import { ParcelForwardingAddressRepository } from '../repositories/forwarding-address-repository'
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
  phoneNumber?: string | null
}

type CreateParcelForwardingAddressUseCaseResponse = Either<
  null,
  {
    parcelForwardingAddress: ParcelForwardingAddress
  }
>

export class CreateParcelForwardingAddressUseCase {
  constructor(
    private parcelForwardingAddressRepository: ParcelForwardingAddressRepository,
  ) {}

  async execute({
    parcelForwardingId,
    address,
    complement,
    city,
    state,
    zipcode,
    country,
    phoneNumber,
  }: CreateParcelForwardingAddressUseCaseRequest): Promise<CreateParcelForwardingAddressUseCaseResponse> {
    const addressInfo = new Address({
      address,
      complement,
      city,
      state,
      zipcode,
      country,
      phoneNumber,
    })

    const parcelForwardingAddress = ParcelForwardingAddress.create({
      parcelForwardingId: new UniqueEntityID(parcelForwardingId),
      address: addressInfo,
    })

    await this.parcelForwardingAddressRepository.create(parcelForwardingAddress)

    return right({
      parcelForwardingAddress,
    })
  }
}
