import { DeclarationModelItem } from '../../enterprise/entities/declaration-model-item'

export abstract class DeclarationModelItemsRepository {
  abstract createMany(
    declarationModelItems: DeclarationModelItem[],
  ): Promise<void>

  abstract findManyByDeclarationModelId(
    declarationModelId: string,
  ): Promise<DeclarationModelItem[] | null>

  abstract deleteMany(
    declarationModelItems: DeclarationModelItem[],
  ): Promise<void>

  abstract deleteManyByDeclarationModelId(
    declarationModelId: string,
  ): Promise<void>
}
