import {
  ParcelForwardingsRepository,
  UpdatePasswordParams,
} from '@/domain/parcel-forwarding/application/repositories/parcel-forwardings-repository'
import { ParcelForwarding } from '@/domain/parcel-forwarding/enterprise/entities/parcel-forwarding'

export class InMemoryParcelForwardingsRepository
  implements ParcelForwardingsRepository
{
  public items: ParcelForwarding[] = []

  async findById(id: string) {
    const company = this.items.find((item) => item.id.toString() === id)

    if (!company) {
      return null
    }

    return company
  }

  async findByEmail(email: string) {
    const company = this.items.find((item) => item.email === email)

    if (!company) {
      return null
    }

    return company
  }

  async create(parcelForwarding: ParcelForwarding) {
    this.items.push(parcelForwarding)
  }

  async updatePassword(data: UpdatePasswordParams): Promise<void> {
    const { email, newPassword } = data
    const company = this.items.find((item) => item.email === email)

    if (company) {
      company.password = newPassword
    } else {
      throw new Error('Company not found')
    }
  }
}
