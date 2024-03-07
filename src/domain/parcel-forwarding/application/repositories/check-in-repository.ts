import { CheckIn } from '../../enterprise/entities/check-in'

export abstract class CheckInRepository {
  abstract create(checkIn: CheckIn): Promise<void>
  abstract findById(id: string): Promise<CheckIn | null>
  abstract save(checkIn: CheckIn): Promise<void>
  abstract delete(checkIn: CheckIn): Promise<void>
}
