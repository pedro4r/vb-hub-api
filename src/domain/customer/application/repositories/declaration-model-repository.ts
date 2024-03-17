import { DeclarationModel } from '../../enterprise/entities/declaration-model'

export abstract class DeclarationModelRepository {
  abstract create(declarationModel: DeclarationModel): Promise<void>
  abstract findById(id: string): Promise<DeclarationModel | null>
  abstract findManyByCustomerId(
    customerId: string,
  ): Promise<DeclarationModel[] | null>

  abstract save(declarationModel: DeclarationModel): Promise<void>
  abstract delete(declarationModel: DeclarationModel): Promise<void>
}
