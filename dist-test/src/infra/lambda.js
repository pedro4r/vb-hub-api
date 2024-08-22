"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const serverless_express_1 = __importDefault(require("@vendia/serverless-express"));
const app_module_1 = require("./app.module");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
let server;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.enableCors({
        origin: [
            'https://d12fe01ihzmtgw.cloudfront.net',
            'http://localhost:5173',
            'http://192.168.1.237:5173',
            'http://192.168.1.209',
        ],
        methods: '*',
        allowedHeaders: 'Content-Type, Authorization, x-requested-with, accept',
        credentials: true,
    });
    app.use((0, cookie_parser_1.default)());
    await app.init();
    const expressApp = app.getHttpAdapter().getInstance();
    return (0, serverless_express_1.default)({ app: expressApp });
}
const handler = async (event, context, callback) => {
    server = server ?? (await bootstrap());
    return server(event, context, callback);
};
exports.handler = handler;
//# sourceMappingURL=lambda.js.map