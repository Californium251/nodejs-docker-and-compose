import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AuthGuard } from '../guards/auth.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlistlists')
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Request() request,
    @Body() createWishlistDto: CreateWishlistDto,
  ) {
    return await this.wishlistService.create(
      createWishlistDto,
      request.user.userId,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return await this.wishlistService.find({
      relations: ['owner', 'items', 'items.owner'],
    });
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const wishlist = await this.wishlistService.findOne({
      where: { id },
      relations: ['owner', 'items', 'items.owner'],
    });

    if (!wishlist) throw new NotFoundException('Вишлист не найден');

    return wishlist;
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return await this.wishlistService.updateOne(
      id,
      updateWishlistDto,
      req.user.userId,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: number) {
    return await this.wishlistService.removeOne(
      {
        where: { id },
        relations: ['owner'],
      },
      req.user.userId,
    );
  }
}
