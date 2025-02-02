import { DomainEvents } from '@/core/events/domain-events'
import { CustomerRepository } from '@/domain/customer/application/repositories/customer-repository'
import { CustomsDeclarationItemsRepository } from '@/domain/customer/application/repositories/customs-declaration-items-repository'
import { PackageRepository } from '@/domain/customer/application/repositories/package-repository'
import { PackageShippingAddressRepository } from '@/domain/customer/application/repositories/package-shipping-address-repository'
import {
  Package,
  PackageStatus,
} from '@/domain/customer/enterprise/entities/package'
import { CheckInsRepository } from '@/domain/parcel-forwarding/application/repositories/check-ins-repository'
import { FilteredPackagesData } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/filtered-packages'
import { PackageDetails } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/package-details'
import { PackagePreview } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/package-preview'

export class InMemoryPackageRepository implements PackageRepository {
  public items: Package[] = []

  constructor(
    private customsDeclarationItemsRepository: CustomsDeclarationItemsRepository,
    private packageShippingAddressRepository: PackageShippingAddressRepository,
    private checkInsRepository: CheckInsRepository,
    private customerRepository: CustomerRepository,
  ) {}

  async findManyByFilter(
    parcelForwardingId: string,
    page: number,
    customersId: string[],
    packageStatus?: PackageStatus,
    startDate?: Date,
    endDate?: Date,
  ) {
    let filteredPackages = this.items.filter(
      (pkg) => pkg.parcelForwardingId.toString() === parcelForwardingId,
    )

    if (customersId.length > 0) {
      filteredPackages = filteredPackages.filter((pkg) =>
        customersId.includes(pkg.customerId.toString()),
      )
    }

    if (packageStatus) {
      filteredPackages = filteredPackages.filter((checkIn) =>
        checkIn.isStatus(packageStatus),
      )
    }

    if (startDate) {
      filteredPackages = filteredPackages.filter(
        (checkIn) => checkIn.createdAt >= startDate,
      )
    }
    if (endDate) {
      filteredPackages = filteredPackages.filter(
        (checkIn) => checkIn.createdAt <= endDate,
      )
    }

    const paginatedPackage = filteredPackages
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    const packagesPreview = await Promise.all(
      paginatedPackage.map(async (pkg) => {
        const customer = await this.customerRepository.findById(
          pkg.customerId.toString(),
        )

        if (!customer) {
          throw new Error(
            `Customer with ID "${pkg.customerId.toString()}" does not exist.`,
          )
        }

        return PackagePreview.create({
          packageId: pkg.id,
          parcelForwardingId: pkg.parcelForwardingId,
          customerId: pkg.customerId,
          hubId: customer.hubId,
          customerFirstName: customer.firstName,
          customerLastName: customer.lastName,
          weight: pkg.weight,
          packageStatus: PackageStatus[pkg.status],
          hasBattery: pkg.hasBattery,
          trackingNumber: pkg.trackingNumber,
          createdAt: pkg.createdAt,
          updatedAt: pkg.updatedAt,
        })
      }),
    )

    return FilteredPackagesData.create({
      packages: packagesPreview,
      meta: {
        pageIndex: page,
        perPage: 20,
        totalCount: filteredPackages.length,
      },
    })
  }

  async findManyByCustomerId(id: string) {
    const packages = this.items.filter(
      (pkg) => pkg.customerId.toString() === id,
    )

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

  async findDetailsById(packageId: string) {
    const pkg = this.items.find((item) => item.id.toString() === packageId)

    if (!pkg) {
      return null
    }

    const customer = await this.customerRepository.findById(
      pkg.customerId.toString(),
    )

    if (!customer) {
      throw new Error(
        `Customer with ID "${pkg.customerId.toString()}" does not exist.`,
      )
    }

    const packageShippindAddress =
      await this.packageShippingAddressRepository.findById(
        pkg.shippingAddressId.toString(),
      )

    if (!packageShippindAddress) {
      throw new Error(
        `Package shipping address with ID "${pkg.shippingAddressId.toString()}" does not exist.`,
      )
    }

    return PackageDetails.create({
      packageId: pkg.id,
      parcelForwardingId: pkg.parcelForwardingId,
      customerId: pkg.customerId,
      packageShippingAddress: packageShippindAddress,
      hubId: customer.hubId,
      customerFirstName: customer.firstName,
      customerLastName: customer.lastName,
      weight: pkg.weight,
      hasBattery: pkg.hasBattery,
      trackingNumber: pkg.trackingNumber,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt,
    })
  }
}
