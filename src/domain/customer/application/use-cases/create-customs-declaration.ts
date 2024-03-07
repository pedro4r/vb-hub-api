import { Either, right } from '@/core/either'
import {
  CustomsDeclaration,
  ItemInfo,
} from '../../enterprise/entities/customs-declaration'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CustomsDeclarationRepository } from '../repositories/customs-declaration-repository'

interface CreateCustomsDeclarationRequest {
  customerId: string
  packageId: string
  itemsList: ItemInfo[]
}

type CreateCustomsDeclarationResponse = Either<
  null,
  {
    customsDeclaration: CustomsDeclaration
  }
>

export class CreateCustomsDeclaration {
  constructor(
    private customDeclarationRepository: CustomsDeclarationRepository,
  ) {}

  async execute({
    customerId,
    packageId,
    itemsList,
  }: CreateCustomsDeclarationRequest): Promise<CreateCustomsDeclarationResponse> {
    const customsDeclaration = CustomsDeclaration.create({
      customerId: new UniqueEntityID(customerId),
      packageId: new UniqueEntityID(packageId),
      itemsList,
    })

    await this.customDeclarationRepository.create(customsDeclaration)

    return right({
      customsDeclaration,
    })
  }
}
