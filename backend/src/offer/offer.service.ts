import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UserService } from '../user/user.service';
import { WishService } from '../wish/wish.service';
import { UpdateWishDto } from '../wish/dto/update-wish.dto';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private userService: UserService,
    private wishService: WishService,
  ) {}

  async findOne(options: FindOneOptions<Offer>) {
    return await this.offerRepository.findOne(options);
  }

  async find(options: FindManyOptions<Offer>) {
    return await this.offerRepository.find(options);
  }

  async getOfferById(id: number) {
    return await this.findOne({
      where: { id },
      relations: ['item', 'user'],
    });
  }

  async getAllOffers() {
    return await this.find({
      relations: ['item', 'user'],
    });
  }

  async create(createOfferDto: CreateOfferDto, userId: number) {
    const wish = await this.wishService.findOne({
      where: { id: createOfferDto.itemId },
      relations: ['owner', 'offers'],
    });

    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }

    if (wish.owner.id === userId) {
      throw new BadRequestException('Нельзя вносить деньги на свой подарок');
    }

    const totalRaised = wish.raised + createOfferDto.amount;
    if (totalRaised > wish.price) {
      throw new BadRequestException(
        'Сумма собранных средств не может превышать стоимость подарка',
      );
    }

    const user = await this.userService.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const offer = await this.offerRepository.create({
      amount: createOfferDto.amount,
      hidden: createOfferDto.hidden || false,
      item: wish,
      user: user,
    });

    const savedOffer = await this.offerRepository.save(offer);

    const updateWishDto = new UpdateWishDto();
    updateWishDto.raised = totalRaised;
    await this.wishService.updateOne(
      { where: { id: wish.id } },
      updateWishDto,
      wish.owner.id,
    );

    return savedOffer;
  }
}
