"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = void 0;
const zod_1 = require("zod");
exports.envSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string().url(),
    JWT_PRIVATE_KEY: zod_1.z.string(),
    JWT_PUBLIC_KEY: zod_1.z.string(),
    CLOUDFLARE_ACCOUNT_ID: zod_1.z.string(),
    CLOUDFLARE_BUCKET_NAME: zod_1.z.string(),
    CLOUDFLARE_ACCESS_KEY_ID: zod_1.z.string(),
    CLOUDFLARE_SECRET_ACCESS_KEY: zod_1.z.string(),
    CLOUDFLARE_DEV_URL: zod_1.z.string(),
    PORT: zod_1.z.coerce.number().optional().default(3333),
});
//# sourceMappingURL=env.js.map