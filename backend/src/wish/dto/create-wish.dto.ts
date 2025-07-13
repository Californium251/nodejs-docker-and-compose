import { IsNumber, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsString()
  @IsUrl()
  link: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  raised: number = 0;

  @IsNumber()
  @IsOptional()
  copied: number = 0;

  @IsString()
  @Length(1, 1024)
  description: string;

  @IsNumber()
  ownerId: number;
}
