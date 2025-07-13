import { Module } from '@nestjs/common';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';
import { UserModule } from '../user/user.module';
import { WishModule } from '../wish/wish.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleConfig } from '../configs/jwtModuleConfig';

@Module({
  imports: [
    TypeOrmModule.forFeature([Offer]),
    JwtModule.registerAsync(jwtModuleConfig),
    UserModule,
    WishModule,
  ],
  controllers: [OfferController],
  providers: [OfferService],
  exports: [OfferService],
})
export class OfferModule {}
