"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_attachments_repository_1 = require("../../../../../test/repositories/in-memory-attachments-repository");
const upload_and_create_attachment_1 = require("./upload-and-create-attachment");
const fake_uploader_1 = require("../../../../../test/storage/fake-uploader");
const invalid_attachment_type_error_1 = require("./errors/invalid-attachment-type-error");
let inMemoryAttachmentsRepository;
let fakeUploader;
let sut;
describe('Upload and create attachment', () => {
    beforeEach(() => {
        inMemoryAttachmentsRepository = new in_memory_attachments_repository_1.InMemoryAttachmentsRepository();
        fakeUploader = new fake_uploader_1.FakeUploader();
        sut = new upload_and_create_attachment_1.UploadAndCreateAttachmentUseCase(inMemoryAttachmentsRepository, fakeUploader);
    });
    it('should be able to upload and create an attachment', async () => {
        const result = await sut.execute({
            fileType: 'image/jpeg',
            body: Buffer.from(''),
        });
        expect(result.isRight()).toBe(true);
        expect(result.value).toEqual({
            attachment: inMemoryAttachmentsRepository.items[0],
        });
        expect(fakeUploader.uploads).toHaveLength(1);
    });
    it('should not be able to upload an attachment with invalid file type', async () => {
        const result = await sut.execute({
            fileType: 'audio/mpeg',
            body: Buffer.from(''),
        });
        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(invalid_attachment_type_error_1.InvalidAttachmentTypeError);
    });
});
//# sourceMappingURL=upload-and-create-attachment.test.js.map