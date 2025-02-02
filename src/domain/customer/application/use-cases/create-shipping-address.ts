import { Either, right } from '@/core/either'
import { ShippingAddressRepository } from '../repositories/shipping-address-repository'
import { Address } from '@/core/value-objects/address'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ShippingAddress } from '../../enterprise/entities/shipping-address'
import { Injectable } from '@nestjs/common'

interface CreateShippingAddressUseCaseRequest {
  customerId: string
  recipientName: string
  taxId?: string | null
  address: string
  phone?: string | null
  email?: string | null
  complement?: string | null
  city: string
  state: string
  zipcode: string
  country: string
}

type CreateShippingAddressUseCaseResponse = Either<
  null,
  {
    shippingAddress: ShippingAddress
  }
>

@Injectable()
export class CreateShippingAddressUseCase {
  constructor(private shippingAddressRepository: ShippingAddressRepository) {}

  async execute({
    customerId,
    recipientName,
    address,
    complement,
    city,
    state,
    zipcode,
    country,
    phone,
    email,
    taxId,
  }: CreateShippingAddressUseCaseRequest): Promise<CreateShippingAddressUseCaseResponse> {
    const addressInfo = new Address({
      address,
      complement,
      city,
      state,
      zipcode,
      country,
    })

    const shippingAddress = ShippingAddress.create({
      customerId: new UniqueEntityID(customerId),
      recipientName,
      phone,
      email,
      taxId,
      address: addressInfo,
    })

    await this.shippingAddressRepository.create(shippingAddress)

    return right({
      shippingAddress,
    })
  }
}
