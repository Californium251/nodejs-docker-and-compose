import { forwardRef, Module } from '@nestjs/common';
import { WishController } from './wish.controller';
import { WishService } from './wish.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleConfig } from '../configs/jwtModuleConfig';
import { WishlistModule } from '../wishlist/wishlist.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wish]),
    JwtModule.registerAsync(jwtModuleConfig),
    UserModule,
    forwardRef(() => WishlistModule),
  ],
  controllers: [WishController],
  providers: [WishService],
  exports: [WishService],
})
export class WishModule {}
