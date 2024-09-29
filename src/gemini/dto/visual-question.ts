import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class VisualQuestionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly prompt: string;

  @IsArray()
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  readonly files: Express.Multer.File[];
}
