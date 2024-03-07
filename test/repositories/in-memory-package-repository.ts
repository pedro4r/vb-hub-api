import { DomainEvents } from '@/core/events/domain-events'
import { CustomsDeclarationRepository } from '@/domain/customer/application/repositories/customs-declaration-repository'
import { PackageRepository } from '@/domain/customer/application/repositories/package-repository'
import { Package } from '@/domain/customer/enterprise/entities/package'

export class InMemoryPackageRepository implements PackageRepository {
  public items: Package[] = []

  constructor(
    private customsDeclarationRepository: CustomsDeclarationRepository,
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
    DomainEvents.dispatchEventsForAggregate(pkg.id)
  }

  async delete(pkg: Package) {
    const index = this.items.findIndex((item) => item.id.equals(pkg.id))
    this.items.splice(index, 1)

    await this.customsDeclarationRepository.delete(pkg.id.toString())
  }
}
