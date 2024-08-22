"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const env_service_1 = require("./env/env.service");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {});
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
    app.getHttpAdapter().getInstance().disable('x-powered-by');
    app.use((0, cookie_parser_1.default)());
    const configService = app.get(env_service_1.EnvService);
    const port = configService.get('PORT');
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map