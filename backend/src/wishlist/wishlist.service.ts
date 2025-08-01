import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, In, Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { WishService } from '../wish/wish.service';
import { omit } from 'lodash';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { UserService } from '../user/user.service';
import _omit from 'lodash/omit';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @Inject(forwardRef(() => WishService))
    private wishService: WishService,
    private userService: UserService,
  ) {}

  async findOne(options: FindOneOptions<Wishlist>) {
    return await this.wishlistRepository.findOne(options);
  }

  async find(options: FindManyOptions<Wishlist>) {
    return await this.wishlistRepository.find(options);
  }

  async create(createWishlistDto: CreateWishlistDto, userId: number) {
    const owner = await this.userService.findOne({ where: { id: userId } });

    if (!owner) throw new NotFoundException('Пользователь не найден');

    let items = [];
    if (createWishlistDto.itemsId && createWishlistDto.itemsId.length > 0) {
      items = await this.wishService.find({
        where: { id: In(createWishlistDto.itemsId) },
      });

      if (items.length === 0) throw new NotFoundException('Подарки не найдены');
    }

    const wishlist = this.wishlistRepository.create({
      name: createWishlistDto.name,
      image: createWishlistDto.image,
      description: createWishlistDto.description,
      items: items,
      owner: owner,
    });

    return await this.wishlistRepository.save(wishlist);
  }

  async updateOne(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const wishlist = await this.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (!wishlist) throw new NotFoundException('Вишлист не найден');

    if (wishlist.owner.id !== userId)
      throw new ForbiddenException('Нельзя редактировать чужой вишлист');

    if (updateWishlistDto.itemsId) {
      const items = await this.wishService.find({
        where: { id: In(updateWishlistDto.itemsId) },
      });

      if (!items) throw new NotFoundException('Товары не найдены');

      for (const item of items) {
        if (wishlist.items.some((i) => i.id === item.id)) continue;
        if (!wishlist.items) wishlist.items = [];
        wishlist.items.push(item);
      }
    }

    for (const key in omit(updateWishlistDto, ['items'])) {
      wishlist[key] = updateWishlistDto[key];
    }

    return await this.wishlistRepository.save(_omit(wishlist, ['itemsId']));
  }

  async removeOne(options: FindOneOptions<Wishlist>, userId: number) {
    const wishlist = await this.findOne(options);

    if (!wishlist) throw new NotFoundException('Вишлист не найден');

    if (wishlist.owner.id !== userId)
      throw new ForbiddenException('Нельзя удалять чужие плейлисты');

    if (!wishlist) throw new NotFoundException('Вишлист не найден');

    return await this.wishlistRepository.remove(wishlist);
  }
}
