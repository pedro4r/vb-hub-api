"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const in_memory_check_ins_repository_1 = require("../../../../../test/repositories/in-memory-check-ins-repository");
const in_memory_check_ins_attachments_repository_1 = require("../../../../../test/repositories/in-memory-check-ins-attachments-repository");
const make_check_in_1 = require("../../../../../test/factories/make-check-in");
const in_memory_customer_repository_1 = require("../../../../../test/repositories/in-memory-customer-repository");
const in_memory_attachments_repository_1 = require("../../../../../test/repositories/in-memory-attachments-repository");
const make_customer_1 = require("../../../../../test/factories/make-customer");
const make_attachment_1 = require("../../../../../test/factories/make-attachment");
const make_check_in_attachment_1 = require("../../../../../test/factories/make-check-in-attachment");
const fetch_recent_check_ins_details_1 = require("./fetch-recent-check-ins-details");
let inMemoryCustomerRepository;
let inMemoryAttachmentsRepository;
let inMemoryCheckInsAttachmentsRepository;
let inMemoryCheckInsRepository;
let sut;
describe('Fetch Recent Check-ins Details', () => {
    beforeEach(() => {
        inMemoryCustomerRepository = new in_memory_customer_repository_1.InMemoryCustomerRepository();
        inMemoryAttachmentsRepository = new in_memory_attachments_repository_1.InMemoryAttachmentsRepository();
        inMemoryCheckInsAttachmentsRepository =
            new in_memory_check_ins_attachments_repository_1.InMemoryCheckInsAttachmentsRepository();
        inMemoryCheckInsRepository = new in_memory_check_ins_repository_1.InMemoryCheckInsRepository(inMemoryCheckInsAttachmentsRepository, inMemoryAttachmentsRepository, inMemoryCustomerRepository);
        sut = new fetch_recent_check_ins_details_1.FetchRecentCheckInsDetailsUseCase(inMemoryCheckInsRepository);
    });
    it('should be able to fetch recent check-ins details', async () => {
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
        inMemoryAttachmentsRepository.items.push((0, make_attachment_1.makeAttachment)({}, new unique_entity_id_1.UniqueEntityID('attachment-1')), (0, make_attachment_1.makeAttachment)({}, new unique_entity_id_1.UniqueEntityID('attachment-2')), (0, make_attachment_1.makeAttachment)({}, new unique_entity_id_1.UniqueEntityID('attachment-3')), (0, make_attachment_1.makeAttachment)({}, new unique_entity_id_1.UniqueEntityID('attachment-4')), (0, make_attachment_1.makeAttachment)({}, new unique_entity_id_1.UniqueEntityID('attachment-5')));
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
        inMemoryCheckInsAttachmentsRepository.items.push((0, make_check_in_attachment_1.makeCheckInAttachment)({
            checkInId: checkIn1.id,
            attachmentId: new unique_entity_id_1.UniqueEntityID('attachment-1'),
        }), (0, make_check_in_attachment_1.makeCheckInAttachment)({
            checkInId: checkIn1.id,
            attachmentId: new unique_entity_id_1.UniqueEntityID('attachment-2'),
        }), (0, make_check_in_attachment_1.makeCheckInAttachment)({
            checkInId: checkIn2.id,
            attachmentId: new unique_entity_id_1.UniqueEntityID('attachment-3'),
        }), (0, make_check_in_attachment_1.makeCheckInAttachment)({
            checkInId: checkIn3.id,
            attachmentId: new unique_entity_id_1.UniqueEntityID('attachment-4'),
        }), (0, make_check_in_attachment_1.makeCheckInAttachment)({
            checkInId: checkIn4.id,
            attachmentId: new unique_entity_id_1.UniqueEntityID('attachment-5'),
        }));
        const result = await sut.execute({
            parcelForwardingId: 'parcel-forwarding-1',
            page: 1,
        });
        expect(inMemoryCheckInsRepository.items.length).toEqual(4);
        expect(result.isRight()).toBeTruthy();
        expect(result.value).toEqual({
            checkInsDetails: expect.arrayContaining([
                expect.objectContaining({
                    checkInId: checkIn1.id,
                    customerId: customer1.id,
                    parcelForwardingId: checkIn1.parcelForwardingId,
                    attachments: expect.arrayContaining([
                        expect.objectContaining({
                            id: new unique_entity_id_1.UniqueEntityID('attachment-1'),
                            url: expect.any(String),
                        }),
                        expect.objectContaining({
                            id: new unique_entity_id_1.UniqueEntityID('attachment-2'),
                            url: expect.any(String),
                        }),
                    ]),
                }),
                expect.objectContaining({
                    checkInId: checkIn2.id,
                    customerId: customer2.id,
                    parcelForwardingId: checkIn1.parcelForwardingId,
                    attachments: expect.arrayContaining([
                        expect.objectContaining({
                            id: new unique_entity_id_1.UniqueEntityID('attachment-3'),
                            url: expect.any(String),
                        }),
                    ]),
                }),
                expect.objectContaining({
                    checkInId: checkIn3.id,
                    customerId: customer3.id,
                    parcelForwardingId: checkIn1.parcelForwardingId,
                    attachments: expect.arrayContaining([
                        expect.objectContaining({
                            id: new unique_entity_id_1.UniqueEntityID('attachment-4'),
                            url: expect.any(String),
                        }),
                    ]),
                }),
                expect.objectContaining({
                    checkInId: checkIn4.id,
                    customerId: customer4.id,
                    parcelForwardingId: checkIn1.parcelForwardingId,
                    attachments: expect.arrayContaining([
                        expect.objectContaining({
                            id: new unique_entity_id_1.UniqueEntityID('attachment-5'),
                            url: expect.any(String),
                        }),
                    ]),
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
//# sourceMappingURL=fetch-recent-check-ins-details.test.js.map