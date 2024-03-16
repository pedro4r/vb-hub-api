import { CustomsDeclaration } from '../../enterprise/entities/customs-declaration'

export abstract class CustomsDeclarationRepository {
  abstract create(customsDeclaration: CustomsDeclaration): Promise<void>
  abstract findById(id: string): Promise<CustomsDeclaration | null>
  abstract findManyByCustomerId(
    customerId: string,
  ): Promise<CustomsDeclaration[] | null>

  abstract save(customsDeclaration: CustomsDeclaration): Promise<void>
  abstract delete(customsDeclaration: CustomsDeclaration): Promise<void>
}
