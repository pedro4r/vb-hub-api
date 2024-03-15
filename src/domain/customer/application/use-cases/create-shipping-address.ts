import { Either, right } from '@/core/either'
import { ShippingAddressRepository } from '../repositories/shipping-address-repository'
import { Address } from '@/core/value-objects/address'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ShippingAddress } from '../../enterprise/entities/shipping-address'

interface CreateShippingAddressUseCaseRequest {
  customerId: string
  recipientName: string
  taxId: string
  address: string
  complement?: string | null
  city: string
  state: string
  zipcode: string
  country: string
  phoneNumber?: string | null
}

type CreateShippingAddressUseCaseResponse = Either<
  null,
  {
    shippingAddress: ShippingAddress
  }
>

export class CreateShippingAddressUseCase {
  constructor(private shippingAddressRepository: ShippingAddressRepository) {}

  async execute({
    customerId,
    recipientName,
    taxId,
    address,
    complement,
    city,
    state,
    zipcode,
    country,
    phoneNumber,
  }: CreateShippingAddressUseCaseRequest): Promise<CreateShippingAddressUseCaseResponse> {
    const addressInfo = new Address({
      address,
      complement,
      city,
      state,
      zipcode,
      country,
      phoneNumber,
    })

    const shippingAddress = ShippingAddress.create({
      customerId: new UniqueEntityID(customerId),
      recipientName,
      taxId,
      address: addressInfo,
    })

    await this.shippingAddressRepository.create(shippingAddress)

    return right({
      shippingAddress,
    })
  }
}
