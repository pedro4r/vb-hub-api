import { Field, Int, ObjectType } from '@nestjs/graphql'
import { DeclarationModelList } from '@/domain/customer/enterprise/entities/declaration-model-list'
@ObjectType()
export class DeclarationModelItemDTO {
  @Field(() => String)
  id: string

  @Field(() => String)
  declarationModelId: string

  @Field(() => String)
  description: string

  @Field(() => Int)
  value: number

  @Field(() => Int)
  quantity: number

  static fromDomain(item: DeclarationModelList): DeclarationModelItemDTO[] {
    const items = item.getItems()

    return items.map((i) => {
      return {
        id: i.id.toString(),
        declarationModelId: i.declarationModelId.toString(),
        description: i.description,
        value: i.value,
        quantity: i.quantity,
      }
    })
  }
}
