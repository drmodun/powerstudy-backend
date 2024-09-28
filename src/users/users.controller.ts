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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { UserResponse } from './entities/user.entity';
import { BaseActionReturn } from 'src/base/baseActionReturn';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOkResponse({ type: BaseActionReturn })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto)[0];
  }

  @Get()
  @ApiOkResponse({ type: [UserResponse] })
  async findAll() {
    return await this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: BaseActionReturn })
  @ApiBearerAuth()
  async update(@Body() updateUserDto: UpdateUserDto, @Req() { user }) {
    return await this.usersService.update(user.id, updateUserDto)[0];
  }

  @Delete(':id')
  @ApiOkResponse({ type: BaseActionReturn })
  async remove(@Req() { user }) {
    return await this.usersService.remove(user.id)[0];
  }

  @Get(':id')
  @ApiOkResponse({ type: UserResponse })
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(+id)[0];
  }
}
