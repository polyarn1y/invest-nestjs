import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    create(createAuthDto: CreateAuthDto): Promise<{
        email: string;
        id: string;
        passwordHash: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(loginAuthDto: LoginAuthDto, res: Response): Promise<{
        user: import("./dto/user-response").UserResponseDto;
        access_token: string;
    }>;
    refresh(req: Request, res: Response): Promise<{
        accessToken: string;
    }>;
}
