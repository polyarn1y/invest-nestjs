import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import argon2 from 'argon2';
import { UserService } from 'src/user/user.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interfaces/jwt.interface';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response';

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_TOKEN_TTL: string;
  private readonly JWT_REFRESH_TOKEN_TTL: string;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.JWT_ACCESS_TOKEN_TTL = this.configService.getOrThrow(
      'JWT_ACCESS_TOKEN_TTL',
    );
    this.JWT_REFRESH_TOKEN_TTL = this.configService.getOrThrow(
      'JWT_REFRESH_TOKEN_TTL',
    );
  }

  private async generateTokens(id: string, email: string) {
    const payload: JwtPayload = { id, email };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.JWT_ACCESS_TOKEN_TTL,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.JWT_REFRESH_TOKEN_TTL,
    });
    return { accessToken, refreshToken };
  }

  async create(createAuthDto: CreateAuthDto) {
    const { email, password } = createAuthDto;
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser)
      throw new ConflictException('User with this email already exists');

    const passwordHash = await argon2.hash(password);
    
    return await this.userService.create({ email, passwordHash });
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const isPasswordValid = await argon2.verify(user.passwordHash, password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.email,
    );
    const userResponse = plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true })
    return { userResponse, accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return await this.generateTokens(payload.id, payload.email);
  }
}
