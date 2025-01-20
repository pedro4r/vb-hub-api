import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CheckInsRepository } from '../repositories/check-ins-repository'
import { Injectable } from '@nestjs/common'
import { CheckInStatus } from '../../enterprise/entities/check-in'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CustomerRepository } from '@/domain/customer/application/repositories/customer-repository'
import { FilteredCheckInAttachmentsData } from '@/domain/customer/enterprise/entities/value-objects/filtered-check-in-attachments'

interface FilterCheckInsDetailsUseCaseRequest {
  parcelForwardingId: string
  customerName?: string
  hubId?: number
  checkInStatus?: CheckInStatus
  startDate?: Date
  endDate?: Date
  page: number
}

type FilterCheckInsDetailsUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    checkInsAttachmentData: FilteredCheckInAttachmentsData
  }
>
@Injectable()
export class FilterCheckInsDetailsUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private customerRepository: CustomerRepository,
  ) {}

  async execute({
    parcelForwardingId,
    page,
    customerName,
    hubId,
    checkInStatus,
    startDate,
    endDate,
  }: FilterCheckInsDetailsUseCaseRequest): Promise<FilterCheckInsDetailsUseCaseResponse> {
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
    const checkInsAttachmentData =
      await this.checkInsRepository.findManyCheckInsAttachmentDetailsByFilter(
        parcelForwardingId,
        page,
        customersId.map((id) => id.toString()),
        checkInStatus,
        startDate,
        endDate,
      )

    if (checkInsAttachmentData.checkInsAttachments.length === 0) {
      return left(new ResourceNotFoundError('Check-ins not found.'))
    }

    if (
      parcelForwardingId !==
      checkInsAttachmentData.checkInsAttachments[0].parcelForwardingId.toString()
    ) {
      return left(
        new NotAllowedError('You are not allowed to fetch these check-ins.'),
      )
    }

    return right({ checkInsAttachmentData })
  }
}
