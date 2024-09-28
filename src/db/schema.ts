import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const subjects = pgEnum('subjects', [
  'math',
  'science',
  'history',
  'language',
  'literature',
  'art',
  'biology',
  'chemistry',
]);

export const levelOfDetail = pgEnum('level_of_detail', [
  'low',
  'medium',
  'high',
]);

export const difficulty = pgEnum('difficulty', [
  'elementary',
  'middle',
  'high',
  'college',
  'unspecified',
]);

export const bookmarkType = pgEnum('bookmark_type', [
  'knowledge_base',
  'note',
  'math_problem',
  'question_answer',
]);

// MVP: add language

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  profilePicture: text('profile_picture'),
  password: text('password').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const knowledgeBase = pgTable('knowledge_base', {
  id: serial('id').primaryKey(),
  subject: subjects('subject').notNull(),
  levelOfDetail: levelOfDetail('level_of_detail').notNull(),
  difficulty: difficulty('difficulty').notNull(),
  title: text('title').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
});

export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const mathProblems = pgTable('math_problem', {
  id: serial('id').primaryKey(),
  mathQuestion: text('question').notNull(),
  difficulty: difficulty('difficulty').notNull(),
  solution: text('answer').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
});

export const questionAnswers = pgTable('question_answer', {
  id: serial('id').primaryKey(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
});

export const bookmarks = pgTable('bookmarks', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  bookmarkType: bookmarkType('bookmark_type').notNull(),
  itemId: integer('item_id').notNull(),
});
