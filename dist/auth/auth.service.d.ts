import { CreateAuthDto } from './dto/create-auth.dto';
import { UserService } from 'src/user/user.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserResponseDto } from './dto/user-response';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private configService;
    private readonly JWT_ACCESS_TOKEN_TTL;
    private readonly JWT_REFRESH_TOKEN_TTL;
    constructor(userService: UserService, jwtService: JwtService, configService: ConfigService);
    private generateTokens;
    create(createAuthDto: CreateAuthDto): Promise<{
        email: string;
        passwordHash: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(loginAuthDto: LoginAuthDto): Promise<{
        userResponse: UserResponseDto;
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
