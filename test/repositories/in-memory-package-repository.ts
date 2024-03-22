import { DomainEvents } from '@/core/events/domain-events'
import { CustomsDeclarationItemsRepository } from '@/domain/customer/application/repositories/customs-declaration-items-repository'
import { PackageRepository } from '@/domain/customer/application/repositories/package-repository'
import { PackageShippingAddressRepository } from '@/domain/customer/application/repositories/package-shipping-address-repository'
import { Package } from '@/domain/customer/enterprise/entities/package'
import { CheckInsRepository } from '@/domain/parcel-forwarding/application/repositories/check-ins-repository'

export class InMemoryPackageRepository implements PackageRepository {
  public items: Package[] = []

  constructor(
    private customsDeclarationItemsRepository: CustomsDeclarationItemsRepository,
    private packageShippingAddressRepository: PackageShippingAddressRepository,
    private checkInsRepository: CheckInsRepository,
  ) {}

  async findManyByCustomerId(id: string) {
    const packages = this.items.filter(
      (pkg) => pkg.customerId.toString() === id,
    )

    if (!packages) {
      return null
    }

    return packages
  }

  async create(pkg: Package) {
    this.items.push(pkg)

    await this.packageShippingAddressRepository.create(
      pkg.shippingAddressId.toString(),
    )

    if (pkg.customsDeclarationList) {
      await this.customsDeclarationItemsRepository.createMany(
        pkg.customsDeclarationList.getItems(),
      )
    }

    await this.checkInsRepository.linkManyCheckInToPackage(
      pkg.checkIns.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(pkg.id)
  }

  async findById(id: string) {
    const pkg = this.items.find((pkg) => pkg.id.toString() === id)
    if (!pkg) {
      return null
    }
    return pkg
  }

  async save(pkg: Package) {
    const index = this.items.findIndex((item) => item.id.equals(pkg.id))
    this.items[index] = pkg

    if (pkg.customsDeclarationList) {
      await this.customsDeclarationItemsRepository.deleteMany(
        pkg.customsDeclarationList.getRemovedItems(),
      )

      await this.customsDeclarationItemsRepository.createMany(
        pkg.customsDeclarationList.getItems(),
      )
    }

    await this.checkInsRepository.unlinkManyCheckInToPackage(
      pkg.checkIns.getRemovedItems(),
    )

    await this.checkInsRepository.linkManyCheckInToPackage(
      pkg.checkIns.getItems(),
    )
    DomainEvents.dispatchEventsForAggregate(pkg.id)
  }

  async delete(pkg: Package) {
    await this.packageShippingAddressRepository.delete(
      pkg.shippingAddressId.toString(),
    )

    await this.customsDeclarationItemsRepository.deleteMany(
      pkg.customsDeclarationList.getItems(),
    )

    await this.checkInsRepository.unlinkManyCheckInToPackage(
      pkg.checkIns.getItems(),
    )

    this.items = this.items.filter((item) => !item.id.equals(pkg.id))
  }
}
