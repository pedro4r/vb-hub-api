"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeUploader = void 0;
const crypto_1 = require("crypto");
class FakeUploader {
    uploads = [];
    async upload() {
        const url = (0, crypto_1.randomUUID)();
        this.uploads.push({
            url,
        });
        return { url };
    }
}
exports.FakeUploader = FakeUploader;
//# sourceMappingURL=fake-uploader.js.map