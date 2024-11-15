import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CheckInsRepository } from '../repositories/check-ins-repository'
import { Injectable } from '@nestjs/common'
import { CheckInPreview } from '../../enterprise/entities/value-objects/check-in-preview'
import { CheckInStatus } from '../../enterprise/entities/check-in'
import { CustomerRepository } from '@/domain/customer/application/repositories/customer-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface FilterCheckInsUseCaseRequest {
  parcelForwardingId: string
  customerName?: string
  hubId?: number
  checkInStatus?: CheckInStatus
  startDate?: Date
  endDate?: Date
  page: number
}

type FilterCheckInsUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    checkInsPreview: CheckInPreview[]
  }
>
@Injectable()
export class FilterCheckInsUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private customerRepository: CustomerRepository,
  ) {}

  async execute({
    parcelForwardingId,
    customerName,
    hubId,
    checkInStatus,
    startDate,
    endDate,
    page,
  }: FilterCheckInsUseCaseRequest): Promise<FilterCheckInsUseCaseResponse> {
    const customersId: UniqueEntityID[] = []
    if (hubId) {
      const customerData = await this.customerRepository.findByHubId(hubId)
      // Check if the customer is associated with the parcel forwarding
      if (
        !customerData ||
        !customerData.parcelForwardingId.equals(
          new UniqueEntityID(parcelForwardingId),
        )
      ) {
        return left(new ResourceNotFoundError('Check-ins not found.'))
      }
      customersId.push(customerData.customerId)
    } else if (customerName) {
      const customersData = await this.customerRepository.findManyByName(
        customerName,
        parcelForwardingId,
        page,
      )

      // Check if the customer is associated with the parcel forwarding
      if (
        customersData &&
        !customersData.customers[0].parcelForwardingId.equals(
          new UniqueEntityID(parcelForwardingId),
        )
      ) {
        return left(new ResourceNotFoundError('Check-ins not found.'))
      }

      customersData.customers.forEach((customer) => {
        customersId.push(customer.customerId)
      })
    }

    const checkInsPreview =
      await this.checkInsRepository.findManyCheckInsByFilter(
        parcelForwardingId,
        page,
        customersId.map((id) => id.toString()),
        checkInStatus,
        startDate,
        endDate,
      )

    if (checkInsPreview.length === 0) {
      return left(new ResourceNotFoundError('Check-ins not found.'))
    }

    return right({ checkInsPreview })
  }
}
