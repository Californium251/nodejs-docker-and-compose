import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UserService } from '../user/user.service';
import { omit } from 'lodash';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    private userService: UserService,
  ) {}

  async findOne(options: FindOneOptions<Wish>) {
    return await this.wishRepository.findOne(options);
  }

  async find(options: FindManyOptions<Wish>) {
    return await this.wishRepository.find(options);
  }

  async findLastWishes() {
    return await this.find({
      order: { createdAt: 'DESC' },
      take: 40,
      relations: ['owner', 'offers'],
    });
  }

  async findTopWishes() {
    return await this.find({
      order: { copied: 'DESC' },
      take: 20,
      relations: ['owner', 'offers'],
    });
  }

  async getWishById(id: number) {
    return await this.findOne({
      where: { id },
      relations: ['owner'],
    });
  }

  async create(createWishDto: CreateWishDto) {
    const owner = await this.userService.findOne({
      where: { id: createWishDto.ownerId },
    });

    if (!owner) throw new NotFoundException('Владелец не найден');

    return await this.wishRepository.save({
      ...omit(createWishDto, ['ownerId', 'offers']),
      owner: owner,
      raised: 0,
      copied: 0,
    });
  }

  async copyWish(wishId: number, newOwnerId: number) {
    const existingWish = await this.findOne({
      where: { id: wishId },
      relations: ['owner'],
    });
    if (!existingWish) throw new NotFoundException('Wish not found');

    const updateWishDto = new UpdateWishDto();
    updateWishDto.copied = existingWish.copied + 1;
    await this.updateOne(
      { where: { id: wishId } },
      updateWishDto,
      existingWish.owner.id,
    );

    const createWishDto = new CreateWishDto();
    createWishDto.ownerId = newOwnerId;
    createWishDto.raised = 0;
    createWishDto.copied = 0;
    createWishDto.name = existingWish.name;
    createWishDto.description = existingWish.description;
    createWishDto.image = existingWish.image;
    createWishDto.link = existingWish.link;
    createWishDto.price = existingWish.price;

    return await this.create(createWishDto);
  }

  async updateOne(
    searchOptions: FindOneOptions<Wish>,
    updateWishDto: UpdateWishDto,
    userId: number,
  ) {
    const wish = await this.findOne({
      ...searchOptions,
      relations: ['offers', 'owner'],
    });

    if (!wish) throw new NotFoundException('Подарок не найден');

    if (wish.owner.id !== userId)
      throw new ForbiddenException('Нельзя менять чужие желания');

    if (updateWishDto.price && wish.offers?.length > 0) {
      throw new BadRequestException(
        'Нельзя менять цену подарка, на который уже есть заявки',
      );
    }

    const updatedWish = {
      ...wish,
      ...omit(updateWishDto, ['ownerId', 'id', 'offers']),
    };

    return await this.wishRepository.save(updatedWish);
  }

  async updateWish(id: number, updateWishDto: UpdateWishDto, userId: number) {
    return await this.updateOne({ where: { id } }, updateWishDto, userId);
  }

  async removeOne(ownerId: number, wishId: number) {
    const wish = await this.wishRepository.findOne({
      where: { id: wishId },
      relations: ['owner'],
    });

    if (!wish) throw new NotFoundException('Нет такого желания');

    if (wish.owner.id !== ownerId)
      throw new UnauthorizedException('Нельзя уничтожать чужие желания');

    return await this.wishRepository.remove(wish);
  }
}
