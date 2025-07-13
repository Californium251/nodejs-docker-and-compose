import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { WishService } from './wish.service';
import { AuthGuard } from '../guards/auth.guard';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishController {
  constructor(private readonly wishService: WishService) {}

  @Get('/last')
  async getLastWishes() {
    return await this.wishService.findLastWishes();
  }

  @Get('/top')
  async getTopWishes() {
    return await this.wishService.findTopWishes();
  }

  @Get(':id')
  async getWish(@Param() param: { id: number }) {
    return await this.wishService.getWishById(param.id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createWish(
    @Request() request,
    @Body() body: Omit<CreateWishDto, 'ownerId'>,
  ) {
    const createWishDto = {
      ...body,
      ownerId: request.user.userId,
    };
    return await this.wishService.create(createWishDto);
  }

  @UseGuards(AuthGuard)
  @Post(':id/copy')
  async copyWish(@Request() request, @Param('id') id: number) {
    return await this.wishService.copyWish(id, request.user.userId);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateWish(
    @Request() request,
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return await this.wishService.updateWish(
      id,
      updateWishDto,
      request.user.userId,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteWish(@Request() request, @Param() params: { id: number }) {
    return await this.wishService.removeOne(request.user.userId, params.id);
  }
}
