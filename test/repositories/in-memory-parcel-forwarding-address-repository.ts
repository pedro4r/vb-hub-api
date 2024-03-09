import { ParcelForwardingAddress } from '@/domain/parcel-forwarding/enterprise/entities/forwarding-address'
import { ParcelForwardingAddressesRepository } from '@/domain/parcel-forwarding/application/repositories/forwarding-addresses-repository'

export class InMemoryParcelForwardingAddressesRepository
  implements ParcelForwardingAddressesRepository
{
  public items: ParcelForwardingAddress[] = []

  async findByParcelForwardingId(parcelForwardingId: string) {
    const parcelForwardingAddress = this.items.find(
      (item) => item.parcelForwardingId.toString() === parcelForwardingId,
    )

    if (!parcelForwardingAddress) {
      return null
    }

    return parcelForwardingAddress
  }

  async findById(parcelForwardingAddressId: string) {
    const parcelForwardingAddress = this.items.find(
      (item) => item.id.toString() === parcelForwardingAddressId,
    )

    if (!parcelForwardingAddress) {
      return null
    }

    return parcelForwardingAddress
  }

  async create(parcelForwardingAddressId: ParcelForwardingAddress) {
    this.items.push(parcelForwardingAddressId)
  }

  async save(parcelForwardingAddress: ParcelForwardingAddress) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === parcelForwardingAddress.id,
    )
    this.items[itemIndex] = parcelForwardingAddress
  }

  async delete(shipppingAddress: ParcelForwardingAddress) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === shipppingAddress.id.toString(),
    )
    this.items.splice(itemIndex, 1)
  }
}
