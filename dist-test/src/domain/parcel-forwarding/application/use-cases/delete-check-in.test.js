"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_check_ins_attachments_repository_1 = require("../../../../../test/repositories/in-memory-check-ins-attachments-repository");
const in_memory_check_ins_repository_1 = require("../../../../../test/repositories/in-memory-check-ins-repository");
const delete_check_in_1 = require("./delete-check-in");
const make_check_in_1 = require("../../../../../test/factories/make-check-in");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const make_check_in_attachment_1 = require("../../../../../test/factories/make-check-in-attachment");
const not_allowed_error_1 = require("../../../../core/errors/errors/not-allowed-error");
const in_memory_customer_repository_1 = require("../../../../../test/repositories/in-memory-customer-repository");
const in_memory_attachments_repository_1 = require("../../../../../test/repositories/in-memory-attachments-repository");
let inMemoryCustomerRepository;
let inMemoryAttachmentsRepository;
let inMemoryCheckInsRepository;
let inMemoryCheckInsAttachmentsRepository;
let sut;
describe('Delete Check-in', () => {
    beforeEach(() => {
        inMemoryCustomerRepository = new in_memory_customer_repository_1.InMemoryCustomerRepository();
        inMemoryAttachmentsRepository = new in_memory_attachments_repository_1.InMemoryAttachmentsRepository();
        inMemoryCheckInsAttachmentsRepository =
            new in_memory_check_ins_attachments_repository_1.InMemoryCheckInsAttachmentsRepository();
        inMemoryCheckInsRepository = new in_memory_check_ins_repository_1.InMemoryCheckInsRepository(inMemoryCheckInsAttachmentsRepository, inMemoryAttachmentsRepository, inMemoryCustomerRepository);
        sut = new delete_check_in_1.DeleteCheckInUseCase(inMemoryCheckInsRepository);
    });
    it('should be able to delete a check-in', async () => {
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
            checkInId: 'check-in-1',
            parcelForwardingId: 'company-1',
        });
        expect(inMemoryCheckInsRepository.items).toHaveLength(0);
        expect(inMemoryCheckInsAttachmentsRepository.items).toHaveLength(0);
    });
    it('should not be able to delete a check-in through parcel-forwarding', async () => {
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
            checkInId: 'check-in-1',
            parcelForwardingId: 'company-2',
        });
        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(not_allowed_error_1.NotAllowedError);
    });
});
//# sourceMappingURL=delete-check-in.test.js.map