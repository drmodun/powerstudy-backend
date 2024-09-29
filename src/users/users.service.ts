import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { db } from 'src/db';
import { users } from 'src/db/schema';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { BaseActionReturn } from 'src/base/baseActionReturn';
import { NoValuesToSetException } from 'src/base/exceptions/custom/noValuesToSetException';
import { UserResponse } from './entities/user.entity';

@Injectable()
export class UsersService {
  async encryptPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async create(createUserDto: CreateUserDto) {
    return (await db
      .insert(users)
      .values(createUserDto)
      .returning({ id: users.id })) satisfies BaseActionReturn[];
  }

  async findAll() {
    return (await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        profilePicture: users.profilePicture,
      })
      .from(users)
      .execute()) satisfies UserResponse[];
  }

  async findOne(id: number) {
    const items = (await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        profilePicture: users.profilePicture,
      })
      .from(users)
      .where(eq(users.id, id))
      .execute()) satisfies UserResponse[];

    if (items.length === 0) {
      throw new NotFoundException('User not found');
    }

    return items;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return (await db
        .update(users)
        .set({
          ...updateUserDto,
          ...(updateUserDto.password && {
            password: await this.encryptPassword(updateUserDto.password),
          }),
        })
        .where(eq(users.id, id))
        .returning({ id: users.id })) satisfies BaseActionReturn[];
    } catch (error) {
      if (error.message === 'No values to set') {
        throw new NoValuesToSetException();
      }
    }
  }

  async remove(id: number) {
    return (await db
      .delete(users)
      .where(eq(users.id, id))) satisfies BaseActionReturn[];
  }

  async userEditCheck(id: number, userId: number) {
    const user = await this.findOne(id);

    return user[0]?.id === userId;
  }
}
