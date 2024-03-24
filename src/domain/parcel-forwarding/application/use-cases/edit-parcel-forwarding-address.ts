import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ParcelForwardingAddress } from '../../enterprise/entities/forwarding-address'
import { ParcelForwardingAddressesRepository } from '../repositories/forwarding-addresses-repository'
import { Address } from '@/core/value-objects/address'

interface EditParcelForwardingAddressUseCaseRequest {
  parcelForwardingId: string
  parcelForwardingAddressId: string
  address: string
  complement?: string | null
  city: string
  state: string
  zipcode: string
  country: string
  phoneNumber?: string | null
}

type EditParcelForwardingAddressUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    parcelForwardingAddress: ParcelForwardingAddress
  }
>

export class EditParcelForwardingAddressUseCase {
  constructor(
    private parcelForwardingAddressesRepository: ParcelForwardingAddressesRepository,
  ) {}

  async execute({
    parcelForwardingId,
    parcelForwardingAddressId,
    address,
    complement,
    city,
    state,
    zipcode,
    country,
  }: EditParcelForwardingAddressUseCaseRequest): Promise<EditParcelForwardingAddressUseCaseResponse> {
    const parcelForwardingAddress =
      await this.parcelForwardingAddressesRepository.findById(
        parcelForwardingAddressId,
      )

    if (!parcelForwardingAddress) {
      return left(new ResourceNotFoundError())
    }

    if (
      parcelForwardingId !==
      parcelForwardingAddress.parcelForwardingId.toString()
    ) {
      return left(new NotAllowedError())
    }

    const newAddress = new Address({
      address,
      city,
      state,
      zipcode,
      country,
      complement,
    })

    parcelForwardingAddress.address = newAddress

    await this.parcelForwardingAddressesRepository.save(parcelForwardingAddress)

    return right({
      parcelForwardingAddress,
    })
  }
}
