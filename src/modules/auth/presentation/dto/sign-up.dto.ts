import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(256)
  password: string;

  @IsString()
  @MinLength(1)
  @MaxLength(80)
  displayName: string;
}
