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
exports.PrismaDeclarationModelItemsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const prisma_declaration_model_items_mapper_1 = require("../mappers/prisma-declaration-model-items-mapper");
let PrismaDeclarationModelItemsRepository = class PrismaDeclarationModelItemsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createMany(declarationModelItems) {
        await Promise.all(declarationModelItems.map((item, index) => {
            const itemData = prisma_declaration_model_items_mapper_1.PrismaDeclarationModelItemsMapper.toPrisma(item, index);
            return this.prisma.declarationModelItem.create({
                data: itemData,
            });
        }));
    }
    async findManyByDeclarationModelId(declarationModelId) {
        const declarationModelItems = await this.prisma.declarationModelItem.findMany({
            where: {
                declarationModelId,
            },
        });
        return declarationModelItems.map(prisma_declaration_model_items_mapper_1.PrismaDeclarationModelItemsMapper.toDomain);
    }
    async deleteMany(declarationModelItems) {
        const declarationModelItemsIds = declarationModelItems.map((item) => {
            return item.id.toString();
        });
        await this.prisma.declarationModelItem.deleteMany({
            where: {
                id: {
                    in: declarationModelItemsIds,
                },
            },
        });
    }
    async deleteManyByDeclarationModelId(declarationModelId) {
        await this.prisma.declarationModelItem.deleteMany({
            where: {
                declarationModelId,
            },
        });
    }
};
exports.PrismaDeclarationModelItemsRepository = PrismaDeclarationModelItemsRepository;
exports.PrismaDeclarationModelItemsRepository = PrismaDeclarationModelItemsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaDeclarationModelItemsRepository);
//# sourceMappingURL=prisma-declaration-model-items-repository.js.map