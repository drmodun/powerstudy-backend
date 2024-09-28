import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { db } from 'src/db/db';
import { users } from 'src/db/schema';
import { eq } from 'drizzle-orm';
import { BaseActionReturn } from 'src/base/baseActionReturn';

@Injectable()
export class UsersService {
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
      .execute()) satisfies BaseActionReturn[];
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
      .execute()) satisfies BaseActionReturn[];

    if (items.length === 0) {
      throw new NotFoundException('User not found');
    }

    return items;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return (await db
      .update(users)
      .set(updateUserDto)
      .where(eq(users.id, id))
      .returning({ id: users.id })) satisfies BaseActionReturn[];
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
