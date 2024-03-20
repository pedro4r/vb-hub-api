import { CustomsDeclarationItem } from '../../enterprise/entities/customs-declaration-item'

export abstract class CustomsDeclarationItemsRepository {
  abstract createMany(
    customsDeclarationItems: CustomsDeclarationItem[],
  ): Promise<void>

  abstract findManyByPackageId(
    packageId: string,
  ): Promise<CustomsDeclarationItem[] | null>

  abstract deleteMany(
    customsDeclarationItems: CustomsDeclarationItem[],
  ): Promise<void>
}
