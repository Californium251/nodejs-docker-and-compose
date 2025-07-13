import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const jwtModuleConfig = {
  useFactory: (configService: ConfigService) => {
    return {
      secret: configService.get<string>('jwtSecret'),
      signOptions: {
        expiresIn: configService.get<string>('jwtExpirationTime'),
      },
    };
  },
  inject: [ConfigService],
} as JwtModuleAsyncOptions;
