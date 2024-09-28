import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { db } from 'src/db/db';
import { users } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto) {
    return await db
      .insert(users)
      .values(createUserDto)
      .returning({ id: users.id });
  }

  async findAll() {
    return await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        profilePicture: users.profilePicture,
      })
      .from(users)
      .execute();
  }

  async findOne(id: number) {
    return await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        profilePicture: users.profilePicture,
      })
      .from(users)
      .where(eq(users.id, id))
      .execute();
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await db
      .update(users)
      .set(updateUserDto)
      .where(eq(users.id, id))
      .returning({ id: users.id });
  }

  async remove(id: number) {
    return await db.delete(users).where(eq(users.id, id));
  }
}
