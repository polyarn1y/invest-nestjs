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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const argon2_1 = __importDefault(require("argon2"));
const user_service_1 = require("../user/user.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const class_transformer_1 = require("class-transformer");
const user_response_1 = require("./dto/user-response");
let AuthService = class AuthService {
    userService;
    jwtService;
    configService;
    JWT_ACCESS_TOKEN_TTL;
    JWT_REFRESH_TOKEN_TTL;
    constructor(userService, jwtService, configService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.JWT_ACCESS_TOKEN_TTL = this.configService.getOrThrow('JWT_ACCESS_TOKEN_TTL');
        this.JWT_REFRESH_TOKEN_TTL = this.configService.getOrThrow('JWT_REFRESH_TOKEN_TTL');
    }
    async generateTokens(id, email) {
        const payload = { id, email };
        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: this.JWT_ACCESS_TOKEN_TTL,
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: this.JWT_REFRESH_TOKEN_TTL,
        });
        return { accessToken, refreshToken };
    }
    async create(createAuthDto) {
        const { email, password } = createAuthDto;
        const existingUser = await this.userService.findByEmail(email);
        if (existingUser)
            throw new common_1.ConflictException('User with this email already exists');
        const passwordHash = await argon2_1.default.hash(password);
        return await this.userService.create({ email, passwordHash });
    }
    async login(loginAuthDto) {
        const { email, password } = loginAuthDto;
        const user = await this.userService.findByEmail(email);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const isPasswordValid = await argon2_1.default.verify(user.passwordHash, password);
        if (!isPasswordValid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email);
        const userResponse = (0, class_transformer_1.plainToInstance)(user_response_1.UserResponseDto, user, { excludeExtraneousValues: true });
        return { userResponse, accessToken, refreshToken };
    }
    async refresh(refreshToken) {
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(refreshToken);
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        return await this.generateTokens(payload.id, payload.email);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map