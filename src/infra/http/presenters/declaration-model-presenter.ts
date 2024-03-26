import { DeclarationModel } from '@/domain/customer/enterprise/entities/declaration-model'

export class DeclarationModelPresenter {
  static toHTTP(declarationModel: DeclarationModel) {
    return {
      id: declarationModel.id.toString(),
      title: declarationModel.title,
      items: declarationModel.items.getItems(),
    }
  }
}
