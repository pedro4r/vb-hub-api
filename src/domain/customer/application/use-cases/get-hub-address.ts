import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { CustomerHubAddress } from '../../enterprise/entities/value-objects/customer-hub-address'
import { CustomerRepository } from '../repositories/customer-repository'
import { ParcelForwardingAddressRepository } from '@/domain/parcel-forwarding/application/repositories/forwarding-address-repository'
import { ShippingAddressRepository } from '../repositories/shipping-address-repository'

interface GetHubAddressUseCaseRequest {
  customerId: string
}

type GetHubAddressUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | null,
  {
    hubAddress: CustomerHubAddress
  }
>

export class GetHubAddressUseCase {
  constructor(
    private customerRepository: CustomerRepository,
    private parcelForwardingAddressRepository: ParcelForwardingAddressRepository,
    private shippingAddressRepository: ShippingAddressRepository,
  ) {}

  async execute({
    customerId,
  }: GetHubAddressUseCaseRequest): Promise<GetHubAddressUseCaseResponse> {
    const shippingAddresses =
      await this.shippingAddressRepository.findManyByCustomerId(customerId)

    if (!shippingAddresses) {
      return left(
        new NotAllowedError(
          'You must have a shipping address to get the hub address',
        ),
      )
    }

    const customer = await this.customerRepository.findById(customerId)

    if (!customer) {
      return left(new ResourceNotFoundError())
    }

    if (customerId !== customer.id.toString()) {
      return left(new NotAllowedError())
    }

    const parcelForwardingAddressRepository =
      await this.parcelForwardingAddressRepository.findByParcelForwardingId(
        customer.parcelForwardingId.toString(),
      )

    if (!parcelForwardingAddressRepository) {
      return left(new ResourceNotFoundError())
    }

    const hubAddress = CustomerHubAddress.create({
      customerHubId: customer.hubId,
      parcelForwardingAddress: parcelForwardingAddressRepository,
    })

    return right({
      hubAddress,
    })
  }
}
