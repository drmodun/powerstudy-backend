import { ApiProperty } from '@nestjs/swagger';
import { IsString, isString } from 'class-validator';

export class CreateMathProblemDto {
  @ApiProperty()
  @IsString()
  mathProblemPicture: string;
}
