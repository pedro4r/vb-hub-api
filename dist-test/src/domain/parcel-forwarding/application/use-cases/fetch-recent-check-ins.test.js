"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const fetch_recent_check_ins_1 = require("./fetch-recent-check-ins");
const in_memory_check_ins_repository_1 = require("../../../../../test/repositories/in-memory-check-ins-repository");
const in_memory_check_ins_attachments_repository_1 = require("../../../../../test/repositories/in-memory-check-ins-attachments-repository");
const make_check_in_1 = require("../../../../../test/factories/make-check-in");
const in_memory_customer_repository_1 = require("../../../../../test/repositories/in-memory-customer-repository");
const in_memory_attachments_repository_1 = require("../../../../../test/repositories/in-memory-attachments-repository");
const make_customer_1 = require("../../../../../test/factories/make-customer");
let inMemoryCustomerRepository;
let inMemoryAttachmentsRepository;
let inMemoryCheckInsAttachmentsRepository;
let inMemoryCheckInsRepository;
let sut;
describe('Fetch Recent Check-ins', () => {
    beforeEach(() => {
        inMemoryCustomerRepository = new in_memory_customer_repository_1.InMemoryCustomerRepository();
        inMemoryAttachmentsRepository = new in_memory_attachments_repository_1.InMemoryAttachmentsRepository();
        inMemoryCheckInsAttachmentsRepository =
            new in_memory_check_ins_attachments_repository_1.InMemoryCheckInsAttachmentsRepository();
        inMemoryCheckInsRepository = new in_memory_check_ins_repository_1.InMemoryCheckInsRepository(inMemoryCheckInsAttachmentsRepository, inMemoryAttachmentsRepository, inMemoryCustomerRepository);
        sut = new fetch_recent_check_ins_1.FetchRecentCheckInsUseCase(inMemoryCheckInsRepository);
    });
    it('should be able to fetch recent check-ins', async () => {
        const customer1 = (0, make_customer_1.makeCustomer)({}, new unique_entity_id_1.UniqueEntityID('customer-1'));
        const customer2 = (0, make_customer_1.makeCustomer)({}, new unique_entity_id_1.UniqueEntityID('customer-2'));
        const customer3 = (0, make_customer_1.makeCustomer)({}, new unique_entity_id_1.UniqueEntityID('customer-3'));
        const customer4 = (0, make_customer_1.makeCustomer)({}, new unique_entity_id_1.UniqueEntityID('customer-4'));
        await Promise.all([
            inMemoryCustomerRepository.create(customer1),
            inMemoryCustomerRepository.create(customer2),
            inMemoryCustomerRepository.create(customer3),
            inMemoryCustomerRepository.create(customer4),
        ]);
        const checkIn1 = (0, make_check_in_1.makeCheckIn)({
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcel-forwarding-1'),
            customerId: customer1.id,
            createdAt: new Date('2021-01-01'),
        });
        const checkIn2 = (0, make_check_in_1.makeCheckIn)({
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcel-forwarding-1'),
            customerId: customer2.id,
            createdAt: new Date('2021-01-02'),
        });
        const checkIn3 = (0, make_check_in_1.makeCheckIn)({
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcel-forwarding-1'),
            customerId: customer3.id,
            createdAt: new Date('2021-01-03'),
        });
        const checkIn4 = (0, make_check_in_1.makeCheckIn)({
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcel-forwarding-1'),
            customerId: customer4.id,
            createdAt: new Date('2021-01-04'),
        });
        await Promise.all([
            inMemoryCheckInsRepository.create(checkIn1),
            inMemoryCheckInsRepository.create(checkIn2),
            inMemoryCheckInsRepository.create(checkIn3),
            inMemoryCheckInsRepository.create(checkIn4),
        ]);
        const result = await sut.execute({
            parcelForwardingId: 'parcel-forwarding-1',
            page: 1,
        });
        expect(inMemoryCheckInsRepository.items.length).toEqual(4);
        expect(result.isRight()).toBeTruthy();
        expect(result.value).toEqual({
            checkInsPreview: expect.arrayContaining([
                expect.objectContaining({
                    checkInId: checkIn1.id,
                    customerId: customer1.id,
                    parcelForwardingId: checkIn1.parcelForwardingId,
                }),
                expect.objectContaining({
                    checkInId: checkIn2.id,
                    customerId: customer2.id,
                    parcelForwardingId: checkIn2.parcelForwardingId,
                }),
                expect.objectContaining({
                    checkInId: checkIn3.id,
                    customerId: customer3.id,
                    parcelForwardingId: checkIn3.parcelForwardingId,
                }),
                expect.objectContaining({
                    checkInId: checkIn4.id,
                    customerId: customer4.id,
                    parcelForwardingId: checkIn4.parcelForwardingId,
                }),
            ]),
        });
    });
    it('should not be able to fetch recent check-ins', async () => {
        const checkIn1 = (0, make_check_in_1.makeCheckIn)({
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcel-forwarding-1'),
            createdAt: new Date('2021-01-01'),
        });
        const checkIn2 = (0, make_check_in_1.makeCheckIn)({
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcel-forwarding-1'),
            createdAt: new Date('2021-01-02'),
        });
        await inMemoryCheckInsRepository.create(checkIn1);
        await inMemoryCheckInsRepository.create(checkIn2);
        const result = await sut.execute({
            parcelForwardingId: 'parcel-forwarding-2',
            page: 1,
        });
        expect(inMemoryCheckInsRepository.items.length).toEqual(2);
        expect(result.isLeft()).toBeTruthy();
    });
});
//# sourceMappingURL=fetch-recent-check-ins.test.js.map