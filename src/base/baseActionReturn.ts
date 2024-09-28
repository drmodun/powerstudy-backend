import { ApiProperty } from '@nestjs/swagger';

export class BaseActionReturn {
  @ApiProperty()
  id: number;
}

export const baseActionExample = {
  id: 1,
};
