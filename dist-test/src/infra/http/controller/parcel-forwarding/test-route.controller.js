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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
const common_1 = require("@nestjs/common");
const public_1 = require("../../../auth/public");
const axios_1 = __importDefault(require("axios"));
let TestController = class TestController {
    async handle() {
        try {
            const response = await axios_1.default.get('https://www.google.com', {
                timeout: 5000,
            });
            return {
                message: 'Internet connectivity test successful',
                status: response.status,
            };
        }
        catch (error) {
            let errorMessage;
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            else {
                errorMessage = 'An unknown error occurred';
            }
            return {
                message: 'Internet connectivity test failed',
                error: errorMessage,
            };
        }
    }
};
exports.TestController = TestController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestController.prototype, "handle", null);
exports.TestController = TestController = __decorate([
    (0, common_1.Controller)('/test'),
    (0, public_1.Public)()
], TestController);
//# sourceMappingURL=test-route.controller.js.map