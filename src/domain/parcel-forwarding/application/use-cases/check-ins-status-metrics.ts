import { Either, right } from '@/core/either'
import { CheckInsRepository } from '../repositories/check-ins-repository'
import { Injectable } from '@nestjs/common'
import { CheckInStatusMetrics } from '../../enterprise/entities/value-objects/check-ins-status-metrics'

interface CheckInsStatusMetricsUseCaseRequest {
  parcelForwardingId: string
}

type CheckInsStatusMetricsUseCaseResponse = Either<
  null,
  {
    checkInStatusMetrics: CheckInStatusMetrics
  }
>
@Injectable()
export class CheckInsStatusMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    parcelForwardingId,
  }: CheckInsStatusMetricsUseCaseRequest): Promise<CheckInsStatusMetricsUseCaseResponse> {
    const checkInStatusMetrics =
      await this.checkInsRepository.getMetricStatus(parcelForwardingId)

    return right({
      checkInStatusMetrics,
    })
  }
}
