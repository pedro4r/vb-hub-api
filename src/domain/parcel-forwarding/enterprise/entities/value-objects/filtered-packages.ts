import { ValueObject } from '@/core/entities/value-object'
import { PackagePreview } from './package-preview'

export interface FilteredPackagesDataProps {
  packages: PackagePreview[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export class FilteredPackagesData extends ValueObject<FilteredPackagesDataProps> {
  get packages() {
    return this.props.packages
  }

  get meta() {
    return this.props.meta
  }

  static create(props: FilteredPackagesDataProps) {
    return new FilteredPackagesData(props)
  }
}
