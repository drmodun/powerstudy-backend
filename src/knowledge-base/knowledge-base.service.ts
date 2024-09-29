import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import db from '../../src/db';
import { and, eq, ilike } from 'drizzle-orm';
import { BaseActionReturn } from '../../src/base/baseActionReturn';
import { NoValuesToSetException } from '../../src/base/exceptions/custom/noValuesToSetException';
import { CreateKnowledgeBaseDto } from './dto/create-knowledge-base.dto';
import { knowledgeBase } from '../../src/db/schema';
import { KnowledgeBaseResponse } from './entities/knowledge-base.entity';
import { UpdateKnowledgeBaseDto } from './dto/update-knowledge-base.dto';
import { KnowledgeBaseQuery } from './dto/query-knowledge-base.dto';

@Injectable()
export class KnowledgeBasesService {
  async checkBaseOwnership(id: number, userId: number) {
    const items = (await db
      .select({
        id: knowledgeBase.id,
      })
      .from(knowledgeBase)
      .where(and(eq(knowledgeBase.id, id), eq(knowledgeBase.userId, userId)))
      .execute()) satisfies BaseActionReturn[];

    return items.length > 0;
  }

  async create(createKnowledgeBaseDto: CreateKnowledgeBaseDto, userId: number) {
    return (await db
      .insert(knowledgeBase)
      .values({
        ...createKnowledgeBaseDto,
        userId,
      })
      .returning({ id: knowledgeBase.id })) satisfies BaseActionReturn[];
  }

  async findAll(query: KnowledgeBaseQuery) {
    return (await db
      .select({
        id: knowledgeBase.id,
        levelOfDetail: knowledgeBase.levelOfDetail,
        title: knowledgeBase.title,
        difficulty: knowledgeBase.difficulty,
        subject: knowledgeBase.subject,
      })
      .from(knowledgeBase)
      .where(
        and(
          query?.title
            ? ilike(knowledgeBase.title, `%${query.title}%`)
            : undefined,
          query?.difficulty
            ? eq(knowledgeBase.difficulty, query.difficulty)
            : undefined,
          query?.subject ? eq(knowledgeBase.subject, query.subject) : undefined,
          query?.levelOfDetail
            ? eq(knowledgeBase.levelOfDetail, query.levelOfDetail)
            : undefined,
        ),
      )
      .offset(query?.page && query?.limit ? query.page * query.limit - 1 : 0)
      .limit(query?.limit ? query.limit : 10)
      .execute()) satisfies KnowledgeBaseResponse[];
  }

  async findOne(id: number) {
    const items = (await db
      .select({
        id: knowledgeBase.id,
        levelOfDetail: knowledgeBase.levelOfDetail,
        title: knowledgeBase.title,
        language: knowledgeBase.language,
        difficulty: knowledgeBase.difficulty,
        subject: knowledgeBase.subject,
      })
      .from(knowledgeBase)
      .where(eq(knowledgeBase.id, id))
      .execute()) satisfies BaseActionReturn[];

    if (items.length === 0) {
      throw new NotFoundException('KnowledgeBase not found');
    }

    return items;
  }

  async update(id: number, updateKnowledgeBaseDto: UpdateKnowledgeBaseDto) {
    try {
      return (await db
        .update(knowledgeBase)
        .set(updateKnowledgeBaseDto)
        .where(eq(knowledgeBase.id, id))
        .returning({ id: knowledgeBase.id })) satisfies BaseActionReturn[];
    } catch (error) {
      if (error.message === 'No values to set') {
        throw new NoValuesToSetException();
      }
    }
  }

  async remove(id: number) {
    return (await db
      .delete(knowledgeBase)
      .where(eq(knowledgeBase.id, id))) satisfies BaseActionReturn[];
  }
}
