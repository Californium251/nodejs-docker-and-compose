import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDataDto } from './dto/login-data.dto';
import { AuthResultDto } from './dto/auth-result.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { User } from '../user/entities/user.entity';
import ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async authenticate(
    input: SignInDto,
    response: Response,
  ): Promise<AuthResultDto> {
    const user = await this.validateUser(input);

    if (!user) throw new UnauthorizedException();

    return this.signIn(user, response);
  }

  async validateUser(input: SignInDto): Promise<LoginDataDto | null> {
    const user = await this.userService.findOne({
      where: { username: input.username },
    });

    if (user) {
      const match = await bcrypt.compare(input.password, user.password);
      if (match)
        return {
          userId: user.id,
          username: user.username,
        };
    }

    return null;
  }

  async signIn(user: LoginDataDto, response: Response): Promise<AuthResultDto> {
    const tokenPayload = {
      sub: user.userId,
      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);
    this.setAuthCookie(response, accessToken);

    return { access_token: accessToken };
  }

  async signUp(user: CreateUserDto, response: Response): Promise<User> {
    const newUser = await this.userService.create(user);
    const tokenPayload = {
      sub: newUser.id,
      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);
    this.setAuthCookie(response, accessToken);

    return newUser;
  }

  setAuthCookie(response: Response, accessToken: string) {
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      expires: new Date(
        Date.now() + ms(this.configService.get('JWT_EXPIRATION_TIME')),
      ),
    });
  }
}
