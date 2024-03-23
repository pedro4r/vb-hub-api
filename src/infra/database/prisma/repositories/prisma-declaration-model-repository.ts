import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { DeclarationModelRepository } from '@/domain/customer/application/repositories/declaration-model-repository'
import { DeclarationModel } from '@/domain/customer/enterprise/entities/declaration-model'

@Injectable()
export class PrismaDeclarationModelRepository
  implements DeclarationModelRepository
{
  constructor(private prisma: PrismaService) {}
  create(declarationModel: DeclarationModel): Promise<void> {
    throw new Error('Method not implemented.')
  }

  findById(id: string): Promise<DeclarationModel | null> {
    throw new Error('Method not implemented.')
  }

  findManyByCustomerId(customerId: string): Promise<DeclarationModel[] | null> {
    throw new Error('Method not implemented.')
  }

  save(declarationModel: DeclarationModel): Promise<void> {
    throw new Error('Method not implemented.')
  }

  delete(declarationModel: DeclarationModel): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
