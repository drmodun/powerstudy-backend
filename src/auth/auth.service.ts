import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/db';
import { users } from '../../src/db/schema';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async userPasswordLogin(email: string, password: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    if (!password) {
      throw new BadRequestException('Password is required');
    }

    const user = await db
      .selectDistinct({
        email: users.email,
        password: users.password,
        id: users.id,
      })
      .from(users)
      .where(eq(users.email, email));

    const selectedUser = user[0] || null;

    if (!selectedUser) {
      throw new BadRequestException('User not found');
    }

    const passwordMatch = await bcrypt.compare(password, selectedUser.password);

    if (!passwordMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({
      id: selectedUser.id,
      email: selectedUser.email,
    });

    return accessToken;
  }
}
