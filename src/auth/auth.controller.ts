import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Req,
  UnauthorizedException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { getCookie, setCookie } from 'src/common/utils/cookie.utils';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('/register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { userResponse, accessToken, refreshToken } =
      await this.authService.login(loginAuthDto);

    setCookie(res, 'refresh_token', refreshToken, "7d");
    
    return { user: userResponse, access_token: accessToken };
  }

  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = getCookie(req, 'refresh_token');
    if (!token) throw new UnauthorizedException('No refresh token provided');

    const { accessToken, refreshToken } = await this.authService.refresh(token);

    setCookie(res, 'refresh_token', refreshToken, "7d");

    return { accessToken };
  }
}
