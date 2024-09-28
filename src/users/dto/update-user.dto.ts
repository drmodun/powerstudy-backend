import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Exclude()
  @IsOptional()
  email?: string;
}
