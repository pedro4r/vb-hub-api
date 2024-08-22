"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaDeclarationModelsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const prisma_declaration_model_mapper_1 = require("../mappers/prisma-declaration-model-mapper");
const declaration_model_item_repository_1 = require("../../../../domain/customer/application/repositories/declaration-model-item-repository");
let PrismaDeclarationModelsRepository = class PrismaDeclarationModelsRepository {
    prisma;
    declarationModelItemsRepository;
    constructor(prisma, declarationModelItemsRepository) {
        this.prisma = prisma;
        this.declarationModelItemsRepository = declarationModelItemsRepository;
    }
    async create(declarationModel) {
        const declarationModelData = prisma_declaration_model_mapper_1.PrismaDeclarationModelMapper.toPrisma(declarationModel);
        await this.prisma.declarationModel.create({
            data: declarationModelData,
        });
        await this.declarationModelItemsRepository.createMany(declarationModel.items.getItems());
    }
    async findById(id) {
        const declarationModel = await this.prisma.declarationModel.findUnique({
            where: {
                id,
            },
        });
        if (!declarationModel) {
            return null;
        }
        return prisma_declaration_model_mapper_1.PrismaDeclarationModelMapper.toDomain(declarationModel);
    }
    async findManyByCustomerId(customerId) {
        const declarationModels = await this.prisma.declarationModel.findMany({
            where: {
                customerId,
            },
        });
        return declarationModels.map(prisma_declaration_model_mapper_1.PrismaDeclarationModelMapper.toDomain);
    }
    async save(declarationModel) {
        await this.prisma.declarationModel.update({
            where: {
                id: declarationModel.id.toString(),
            },
            data: {
                title: declarationModel.title,
            },
        });
        await this.declarationModelItemsRepository.deleteMany(declarationModel.items.getRemovedItems());
        await this.declarationModelItemsRepository.createMany(declarationModel.items.getNewItems());
    }
    async delete(declarationModel) {
        await this.declarationModelItemsRepository.deleteManyByDeclarationModelId(declarationModel.id.toString());
        await this.prisma.declarationModel.delete({
            where: {
                id: declarationModel.id.toString(),
            },
        });
    }
};
exports.PrismaDeclarationModelsRepository = PrismaDeclarationModelsRepository;
exports.PrismaDeclarationModelsRepository = PrismaDeclarationModelsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        declaration_model_item_repository_1.DeclarationModelItemsRepository])
], PrismaDeclarationModelsRepository);
//# sourceMappingURL=prisma-declaration-models-repository.js.map