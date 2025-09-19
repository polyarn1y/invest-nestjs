import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJwtConfig = async (
  configService: ConfigService,
): Promise<JwtModuleOptions> => {
  return {
    global: true,
    secret: configService.getOrThrow<string>('JWT_SECRET'),
    signOptions: {
      expiresIn: '15m',
    },
  };
};
