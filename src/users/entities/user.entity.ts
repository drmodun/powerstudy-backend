import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UserResponse {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  profilePicture?: string;
}
