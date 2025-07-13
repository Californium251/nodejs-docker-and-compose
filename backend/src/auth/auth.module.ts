import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import authConfig from '../configs/auth.config';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleConfig } from '../configs/jwtModuleConfig';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    UserModule,
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync(jwtModuleConfig),
  ],
})
export class AuthModule {}
