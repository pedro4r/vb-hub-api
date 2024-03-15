import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CustomsDeclaration } from '../../enterprise/entities/customs-declaration'
import { CustomsDeclarationRepository } from '../repositories/customs-declaration-repository'
import {
  CustomsDeclarationItem,
  CustomsDeclarationItemProps,
} from '../../enterprise/entities/customs-declaration-item'
import { CustomsDeclarationList } from '../../enterprise/entities/customs-declaration-list'
interface CreateCustomsDeclarationRequest {
  customerId: string
  title: string
  customsDeclarationItems: CustomsDeclarationItemProps[]
}

type CreateCustomsDeclarationResponse = Either<
  null,
  {
    customsDeclaration: CustomsDeclaration
  }
>

export class CreateCustomsDeclaration {
  constructor(
    private customsDeclarationRepository: CustomsDeclarationRepository,
  ) {}

  async execute({
    customerId,
    title,
    customsDeclarationItems,
  }: CreateCustomsDeclarationRequest): Promise<CreateCustomsDeclarationResponse> {
    const customsDeclaration = CustomsDeclaration.create({
      customerId: new UniqueEntityID(customerId),
      title,
    })

    const itemsList = customsDeclarationItems.map((item) => {
      return CustomsDeclarationItem.create({
        customsDeclarationId: customsDeclaration.id,
        description: item.description,
        value: item.value,
        quantity: item.quantity,
      })
    })

    customsDeclaration.items = new CustomsDeclarationList(itemsList)

    await this.customsDeclarationRepository.create(customsDeclaration)

    return right({
      customsDeclaration,
    })
  }
}
