"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtConfig = void 0;
const getJwtConfig = async (configService) => {
    return {
        global: true,
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: {
            expiresIn: '15m',
        },
    };
};
exports.getJwtConfig = getJwtConfig;
//# sourceMappingURL=jwt.config.js.map