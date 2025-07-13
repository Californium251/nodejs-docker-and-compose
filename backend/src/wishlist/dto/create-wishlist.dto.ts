import {
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsString()
  @MaxLength(1500)
  @IsOptional()
  description: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsArray()
  @ArrayNotEmpty()
  itemsId: number[];
}
