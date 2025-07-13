import {
  IsEmail, IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength, ValidateIf
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&].*$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
    },
  )
  password: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Слишком длинное описание' })
  @MinLength(10, { message: 'Слишком короткое описание' })
  @ValidateIf((o) => o.about !== '')
  about?: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;
}
