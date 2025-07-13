import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindManyOptions, FindOneOptions, ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = await this.userRepository.save({
        ...createUserDto,
        password: hashedPassword,
      });
      return newUser;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Такой пользователь уже зарегистрирован');
      }
      throw error;
    }
  }

  async findOne(options: FindOneOptions<User>) {
    return await this.userRepository.findOne(options);
  }

  async find(options: FindManyOptions<User>) {
    return await this.userRepository.find(options);
  }

  async getUserByUserName(username: string) {
    return await this.findOne({
      where: { username },
    });
  }

  async findUserByEmailOrUserName(query: string) {
    if (!query) throw new BadRequestException('Пустой запрос');

    return await this.find({
      where: [
        { username: ILike(`%${query}%`) },
        { email: ILike(`%${query}%`) },
      ],
    });
  }

  async updateOne(
    username: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = {
      ...user,
      ...updateUserDto,
    };

    try {
      const user = await this.userRepository.save(updatedUser);
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          'Пользователь с таким именем уже существует',
        );
      }
      throw error;
    }
  }

  async removeOne(options: FindOneOptions<User>) {
    const user = await this.findOne(options);

    if (!user) {
      throw new NotFoundException(`Пользователь  не найден`);
    }

    return await this.userRepository.remove(user);
  }

  async getUserWishes(username: string) {
    const user = await this.findOne({
      where: { username },
      relations: ['wishes', 'wishes.owner', 'wishlists'],
    });

    if (!user) throw new NotFoundException('Пользователь не найден');

    return user.wishes;
  }
}
