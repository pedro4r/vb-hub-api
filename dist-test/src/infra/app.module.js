"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_module_1 = require("./auth/auth.module");
const http_module_1 = require("./http/http.module");
const env_1 = require("./env/env");
const env_module_1 = require("./env/env.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply((0, cookie_parser_1.default)()).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                validate: (env) => env_1.envSchema.parse(env),
                isGlobal: true,
            }),
            auth_module_1.AuthModule,
            http_module_1.HttpModule,
            env_module_1.EnvModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map