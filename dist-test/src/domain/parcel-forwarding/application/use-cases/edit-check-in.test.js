"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const make_check_in_1 = require("../../../../../test/factories/make-check-in");
const in_memory_check_ins_attachments_repository_1 = require("../../../../../test/repositories/in-memory-check-ins-attachments-repository");
const in_memory_check_ins_repository_1 = require("../../../../../test/repositories/in-memory-check-ins-repository");
const edit_check_in_1 = require("./edit-check-in");
const make_check_in_attachment_1 = require("../../../../../test/factories/make-check-in-attachment");
const in_memory_customer_repository_1 = require("../../../../../test/repositories/in-memory-customer-repository");
const in_memory_attachments_repository_1 = require("../../../../../test/repositories/in-memory-attachments-repository");
let inMemoryCustomerRepository;
let inMemoryAttachmentsRepository;
let inMemoryCheckInsRepository;
let inMemoryCheckInsAttachmentsRepository;
let sut;
describe('Edit Question', () => {
    beforeEach(() => {
        inMemoryCustomerRepository = new in_memory_customer_repository_1.InMemoryCustomerRepository();
        inMemoryAttachmentsRepository = new in_memory_attachments_repository_1.InMemoryAttachmentsRepository();
        inMemoryCheckInsAttachmentsRepository =
            new in_memory_check_ins_attachments_repository_1.InMemoryCheckInsAttachmentsRepository();
        inMemoryCheckInsRepository = new in_memory_check_ins_repository_1.InMemoryCheckInsRepository(inMemoryCheckInsAttachmentsRepository, inMemoryAttachmentsRepository, inMemoryCustomerRepository);
        sut = new edit_check_in_1.EditCheckInUseCase(inMemoryCheckInsRepository, inMemoryCheckInsAttachmentsRepository);
    });
    it('should be able to edit a check-in', async () => {
        const newCheckIn = (0, make_check_in_1.makeCheckIn)({
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('company-1'),
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
        }, new unique_entity_id_1.UniqueEntityID('check-in-1'));
        await inMemoryCheckInsRepository.create(newCheckIn);
        inMemoryCheckInsAttachmentsRepository.items.push((0, make_check_in_attachment_1.makeCheckInAttachment)({
            checkInId: newCheckIn.id,
            attachmentId: new unique_entity_id_1.UniqueEntityID('1'),
        }), (0, make_check_in_attachment_1.makeCheckInAttachment)({
            checkInId: newCheckIn.id,
            attachmentId: new unique_entity_id_1.UniqueEntityID('2'),
        }));
        await sut.execute({
            checkInId: newCheckIn.id.toValue(),
            parcelForwardingId: 'company-1',
            customerId: 'customer-1',
            status: 1,
            weight: 1,
            details: 'New details',
            attachmentsIds: ['1', '3'],
        });
        expect(inMemoryCheckInsRepository.items[0]).toMatchObject({
            details: 'New details',
        });
        expect(inMemoryCheckInsRepository.items[0].attachments.currentItems).toHaveLength(2);
        expect(inMemoryCheckInsRepository.items[0].attachments.currentItems).toEqual([
            expect.objectContaining({ attachmentId: new unique_entity_id_1.UniqueEntityID('1') }),
            expect.objectContaining({ attachmentId: new unique_entity_id_1.UniqueEntityID('3') }),
        ]);
    });
    it('should sync new and removed attachment when editing a check-in', async () => {
        const newCheckIn = (0, make_check_in_1.makeCheckIn)({
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('company-1'),
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
        }, new unique_entity_id_1.UniqueEntityID('check-in-1'));
        await inMemoryCheckInsRepository.create(newCheckIn);
        inMemoryCheckInsAttachmentsRepository.items.push((0, make_check_in_attachment_1.makeCheckInAttachment)({
            checkInId: newCheckIn.id,
            attachmentId: new unique_entity_id_1.UniqueEntityID('1'),
        }), (0, make_check_in_attachment_1.makeCheckInAttachment)({
            checkInId: newCheckIn.id,
            attachmentId: new unique_entity_id_1.UniqueEntityID('2'),
        }));
        const result = await sut.execute({
            checkInId: newCheckIn.id.toValue(),
            parcelForwardingId: 'company-1',
            customerId: 'customer-1',
            status: 1,
            weight: 1,
            details: 'New details',
            attachmentsIds: ['1', '3'],
        });
        expect(result.isRight()).toBe(true);
        expect(inMemoryCheckInsAttachmentsRepository.items).toHaveLength(2);
        expect(inMemoryCheckInsAttachmentsRepository.items).toEqual(expect.arrayContaining([
            expect.objectContaining({
                attachmentId: new unique_entity_id_1.UniqueEntityID('1'),
            }),
            expect.objectContaining({
                attachmentId: new unique_entity_id_1.UniqueEntityID('3'),
            }),
        ]));
    });
});
//# sourceMappingURL=edit-check-in.test.js.map