import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AppDataSource } from './ormconfig';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { WishModule } from './wish/wish.module';
import { OfferModule } from './offer/offer.module';
import { WishlistModule } from './wishlist/wishlist.module';
import configuration from './configs/configuration';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RemovePasswordInterceptor } from './interceptors/remove-password.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    TypeOrmModule.forRoot(AppDataSource.options),
    UserModule,
    AuthModule,
    WishModule,
    OfferModule,
    WishlistModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RemovePasswordInterceptor,
    },
  ],
})
export class AppModule {}
