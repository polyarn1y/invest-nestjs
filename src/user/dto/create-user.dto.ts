import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly passwordHash: string;
}
