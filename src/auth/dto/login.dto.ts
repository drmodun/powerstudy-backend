import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty()
  accessToken: string;
}

export class LoginInfo {
  @ApiProperty()
  email: string;

  @ApiProperty()
  id: string;
}
