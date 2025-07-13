import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OfferService } from './offer.service';

@Controller('offers')
export class OfferController {
  constructor(private offerService: OfferService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Request() request, @Body() createOfferDto: CreateOfferDto) {
    return await this.offerService.create(createOfferDto, request.user.userId);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return await this.offerService.getAllOffers();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.offerService.getOfferById(id);
  }
}
