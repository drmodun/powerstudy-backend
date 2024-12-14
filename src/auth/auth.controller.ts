import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth-guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto, LoginResponseDto } from './dto/login.dto';

import { UsersService } from '../../src/users/users.service';
import { UserResponse } from 'src/users/entities/user.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @ApiCreatedResponse({ type: LoginResponseDto })
  async login(@Body() login: LoginDto) {
    const accessToken = await this.authService.userPasswordLogin(
      login.email,
      login.password,
    );

    return {
      access_token: accessToken,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserResponse })
  @Get('me')
  async whoami(@Req() { user }) {
    const userInfo = await this.usersService.findOne(user.id);

    return userInfo[0];
  }
}
