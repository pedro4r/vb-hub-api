import { CustomsDeclaration } from '../../enterprise/entities/customs-declaration'

export abstract class CustomsDeclarationRepository {
  abstract create(customsDeclaration: CustomsDeclaration): Promise<void>
  abstract findById(packageId: string): Promise<CustomsDeclaration | null>
  abstract delete(packageId: string): Promise<void>
  abstract save(customsDeclaration: CustomsDeclaration): Promise<void>
}
