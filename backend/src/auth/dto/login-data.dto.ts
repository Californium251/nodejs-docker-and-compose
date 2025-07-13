import { IsNumber, IsString } from 'class-validator';

export class LoginDataDto {
  @IsNumber()
  userId: number;

  @IsString()
  username: string;
}
