import { Either, left, right } from '@/core/either'
import {
  CustomsDeclaration,
  ItemInfo,
} from '../../enterprise/entities/customs-declaration'
import { CustomsDeclarationRepository } from '../repositories/customs-declaration-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface EditCustomsDeclarationRequest {
  customerId: string
  packageId: string
  itemsList: ItemInfo[]
}

type EditCustomsDeclarationResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    customsDeclaration: CustomsDeclaration
  }
>

export class EditCustomsDeclaration {
  constructor(
    private customDeclarationRepository: CustomsDeclarationRepository,
  ) {}

  async execute({
    customerId,
    packageId,
    itemsList,
  }: EditCustomsDeclarationRequest): Promise<EditCustomsDeclarationResponse> {
    const customsDeclaration =
      await this.customDeclarationRepository.findById(packageId)

    if (!customsDeclaration) {
      return left(new ResourceNotFoundError())
    }

    if (customsDeclaration.customerId.toString() !== customerId) {
      return left(new NotAllowedError())
    }

    const newCustomsDeclaration = CustomsDeclaration.create({
      customerId: new UniqueEntityID(customerId),
      packageId: new UniqueEntityID(packageId),
      itemsList,
    })

    await this.customDeclarationRepository.save(newCustomsDeclaration)

    return right({
      customsDeclaration,
    })
  }
}
