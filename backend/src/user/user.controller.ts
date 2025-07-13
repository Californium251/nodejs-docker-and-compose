import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../guards/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  async getMyInfo(@Request() request) {
    return await this.userService.getUserByUserName(request.user.username);
  }

  @UseGuards(AuthGuard)
  @Patch('me')
  async updateMyInfo(@Request() request, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateOne(request.user.username, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('me/wishes')
  async getMyWishes(@Request() request) {
    return await this.userService.getUserWishes(request.user.username);
  }

  @UseGuards(AuthGuard)
  @Post('find')
  async findUsers(@Body() body: { query: string }) {
    const { query } = body;

    return await this.userService.findUserByEmailOrUserName(query);
  }

  @Get(':username')
  async getUserInfo(@Param() params: { username: string }) {
    return await this.userService.getUserByUserName(params.username);
  }

  @Get(':username/wishes')
  async getUserWishes(@Param() params: { username: string }) {
    return await this.userService.getUserWishes(params.username);
  }
}
