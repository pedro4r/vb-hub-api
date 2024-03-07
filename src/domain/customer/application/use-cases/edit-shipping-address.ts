import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ShippingAddressRepository } from '../repositories/shipping-address-repository'
import { ShippingAddress } from '../../enterprise/entities/shipping-address'
import { Address } from '@/core/value-objects/address'

interface EditShippingAddressUseCaseRequest {
  shippingAddressId: string
  customerId: string
  recipientName: string
  address: string
  complement?: string | null
  city: string
  state: string
  zipcode: string
  country: string
  phoneNumber?: string | null
}

type EditShippingAddressUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    shippingAddress: ShippingAddress
  }
>

export class EditShippingAddressUseCase {
  constructor(private shippingAddressRepository: ShippingAddressRepository) {}

  async execute({
    shippingAddressId,
    customerId,
    recipientName,
    address,
    complement,
    city,
    state,
    zipcode,
    country,
    phoneNumber,
  }: EditShippingAddressUseCaseRequest): Promise<EditShippingAddressUseCaseResponse> {
    const shippingAddress =
      await this.shippingAddressRepository.findById(shippingAddressId)

    if (!shippingAddress) {
      return left(new ResourceNotFoundError())
    }

    if (customerId !== shippingAddress.customerId.toString()) {
      return left(new NotAllowedError())
    }

    shippingAddress.recipientName = recipientName

    const newAddress = new Address({
      address,
      city,
      state,
      zipcode,
      country,
      complement,
      phoneNumber,
    })

    shippingAddress.address = newAddress

    await this.shippingAddressRepository.save(shippingAddress)

    return right({
      shippingAddress,
    })
  }
}
