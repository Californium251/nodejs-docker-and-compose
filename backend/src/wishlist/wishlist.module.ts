import { forwardRef, Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishModule } from '../wish/wish.module';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleConfig } from '../configs/jwtModuleConfig';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist]),
    JwtModule.registerAsync(jwtModuleConfig),
    forwardRef(() => WishModule),
    UserModule,
  ],
  controllers: [WishlistController],
  providers: [WishlistService],
  exports: [WishlistService],
})
export class WishlistModule {}
