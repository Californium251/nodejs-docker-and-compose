import { IsString } from 'class-validator';

export class AuthResultDto {
  @IsString()
  access_token: string;
}
