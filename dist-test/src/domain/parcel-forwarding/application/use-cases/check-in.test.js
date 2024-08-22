"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_in_1 = require("./check-in");
const in_memory_check_ins_repository_1 = require("../../../../../test/repositories/in-memory-check-ins-repository");
const in_memory_check_ins_attachments_repository_1 = require("../../../../../test/repositories/in-memory-check-ins-attachments-repository");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const in_memory_customer_repository_1 = require("../../../../../test/repositories/in-memory-customer-repository");
const in_memory_attachments_repository_1 = require("../../../../../test/repositories/in-memory-attachments-repository");
let inMemoryCustomerRepository;
let inMemoryAttachmentsRepository;
let inMemoryCheckInsRepository;
let inMemoryCheckInsAttachmentsRepository;
let sut;
describe('Check-in', () => {
    beforeEach(() => {
        inMemoryCustomerRepository = new in_memory_customer_repository_1.InMemoryCustomerRepository();
        inMemoryAttachmentsRepository = new in_memory_attachments_repository_1.InMemoryAttachmentsRepository();
        inMemoryCheckInsAttachmentsRepository =
            new in_memory_check_ins_attachments_repository_1.InMemoryCheckInsAttachmentsRepository();
        inMemoryCheckInsRepository = new in_memory_check_ins_repository_1.InMemoryCheckInsRepository(inMemoryCheckInsAttachmentsRepository, inMemoryAttachmentsRepository, inMemoryCustomerRepository);
        sut = new check_in_1.CheckInUseCase(inMemoryCheckInsRepository);
    });
    it('should be able to check in', async () => {
        const result = await sut.execute({
            parcelForwardingId: 'A1',
            customerId: 'A2',
            status: 1,
            details: 'Package details',
            attachmentsIds: ['1', '2'],
        });
        expect(result.isRight()).toBe(true);
        expect(inMemoryCheckInsRepository.items[0]).toEqual(result.value?.checkin);
        expect(inMemoryCheckInsRepository.items[0].attachments.currentItems).toHaveLength(2);
        expect(inMemoryCheckInsRepository.items[0].attachments.currentItems).toEqual([
            expect.objectContaining({ attachmentId: new unique_entity_id_1.UniqueEntityID('1') }),
            expect.objectContaining({ attachmentId: new unique_entity_id_1.UniqueEntityID('2') }),
        ]);
    });
    it('should persist attachments when check in', async () => {
        const result = await sut.execute({
            parcelForwardingId: 'A1',
            customerId: 'A2',
            status: 1,
            details: 'Package details',
            attachmentsIds: ['1', '2'],
        });
        expect(result.isRight()).toBe(true);
        expect(inMemoryCheckInsAttachmentsRepository.items).toHaveLength(2);
        expect(inMemoryCheckInsAttachmentsRepository.items).toEqual(expect.arrayContaining([
            expect.objectContaining({
                attachmentId: new unique_entity_id_1.UniqueEntityID('1'),
            }),
            expect.objectContaining({
                attachmentId: new unique_entity_id_1.UniqueEntityID('1'),
            }),
        ]));
    });
});
//# sourceMappingURL=check-in.test.js.map