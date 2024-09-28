import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { UserResponse } from './entities/user.entity';
import { BaseActionReturn } from 'src/base/baseActionReturn';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: BaseActionReturn })
  async create(@Body() createUserDto: CreateUserDto) {
    const action = await this.usersService.create(createUserDto);

    return action[0];
  }

  @Get()
  @ApiOkResponse({ type: [UserResponse] })
  async findAll() {
    return await this.usersService.findAll();
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: BaseActionReturn })
  @ApiBearerAuth()
  async update(@Body() updateUserDto: UpdateUserDto, @Req() { user }) {
    const action = await this.usersService.update(user.id, updateUserDto);

    return action[0];
  }

  @Delete(':id')
  @ApiOkResponse({ type: BaseActionReturn })
  async remove(@Req() { user }) {
    const action = await this.usersService.remove(user.id);

    return action[0];
  }

  @Get(':id')
  @ApiOkResponse({ type: UserResponse })
  async findOne(@Param('id') id: string) {
    const action = await this.usersService.findOne(+id);

    return action[0];
  }
}
