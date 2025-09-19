"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookie = setCookie;
const ms_1 = __importDefault(require("ms"));
function setCookie(response, name, value, maxAge = '15m', cookieOptions) {
    const maxAgeMs = typeof maxAge === 'number' ? maxAge : (0, ms_1.default)(maxAge);
    response.cookie(name, value, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: maxAgeMs,
        ...cookieOptions
    });
}
//# sourceMappingURL=set-cookie.utils.js.map