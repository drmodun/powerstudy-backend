import { Injectable } from '@nestjs/common';
import {
  CreateNoteDto,
  GenerateNotesDto,
  PromptOptions,
} from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { KnowledgeBasesService } from 'src/knowledge-base/knowledge-base.service';
import ISO6391 from 'iso-639-1';
import { GeminiService } from 'src/gemini/gemini.service';
import { bookmarks, knowledgeBase, notes, users } from 'src/db/schema';
import { QueryNoteDto } from './dto/query-note.dto';
import { and, ilike, eq, count } from 'drizzle-orm';
import db from 'src/db';
import { NoteResponse, NoteResponseExtended } from './entities/note.entity';
import { SchemaType } from '@google/generative-ai';

@Injectable()
export class NotesService {
  constructor(
    private readonly knowledgeBaseService: KnowledgeBasesService,
    private readonly geminiService: GeminiService,
  ) {}

  getPrompt(options: PromptOptions) {
    return `As a Gemini AI model, your task is to extract notes about ${options.title} from various study resources provided in the form of images. The extracted notes should be in the ${this.getLanguageString(options.language)} language. The level of detail in the notes should be ${this.getLevelOfDetailString(options.levelOfDetail)}. The difficulty level of the study material is ${this.getDifficultyString(options.difficulty || 'high')}. The subject of the study material is ${options.subject}.
    For ${options?.subject}, focus on ${this.getSubjectString(options.subject)}. If some of these are not mentioned, do not add them.
    Remember to maintain a logical and coherent structure in the notes, starting from basic concepts and gradually moving to more complex topics. Use bullet points, headings, and subheadings to organize the notes and make them easy to read and understand.
    Also, output the notes in the markdown format for better readability.
    For information that is not provided in the study resources or unclear, you can try to infer it based on the context or leave it out.
    Please ensure the accuracy of the information in the notes, as they will be used for studying and revision purposes. Also, keep the language clear and concise, avoiding any unnecessary jargon or complex sentences.
    Finally, provide a summary at the end of each topic, highlighting the main points and key takeaways. This will help in quick revision and understanding of the topic`;
  }

  async getLanguageString(language: string) {
    return ISO6391.getName(language || 'en') || 'English';
  }

  async getLevelOfDetailString(levelOfDetail: string) {
    switch (levelOfDetail) {
      case 'high':
        return 'very comprehensive, covering all key points and concepts from the study resources';
      case 'medium':
        return 'relatively detailed, including all relevant information from the study resources';
      case 'low':
        return 'concise, focusing on the most important points and concepts from the study resources';
      default:
        return 'comprehensive, covering all key points and concepts from the study resources';
    }
  }

  async getDifficultyString(difficulty: string) {
    switch (difficulty) {
      case 'college':
        return 'undergraduate college level';
      case 'high':
        return 'high school level';
      case 'middle':
        return 'middle school level';
      case 'elementary':
        return 'elementary school level';
      default:
        return 'undergraduate college level';
    }
  }

  async getSubjectString(subject: string) {
    switch (subject) {
      case 'physics':
        return 'extracting formulas, laws, principles, and their explanations. Also, pay attention to diagrams and their descriptions. Make sure to include any examples or problem-solving methods provided in the study resources';
      case 'chemistry':
        return 'extracting chemical formulas, reactions, principles, and their explanations. Also, pay attention to diagrams, especially those representing molecular structures, and their descriptions. Make sure to include any examples or problem-solving methods provided in the study resources, particularly those related to stoichiometry and thermodynamics.';
      case 'mathematics':
        return 'extracting formulas, theorems, proofs, and their explanations. Pay special attention to diagrams, especially those representing geometric figures or mathematical functions, and their descriptions. Make sure to include any examples or problem-solving methods provided in the study resources, particularly those related to algebra, calculus, and statistics.';
      case 'biology':
        return 'extracting information about biological processes, structures, and functions. Pay special attention to diagrams, especially those representing cell structures, body systems, or ecological relationships, and their descriptions. Make sure to include any examples or problem-solving methods provided in the study resources, particularly those related to genetics, evolution, and ecology.';
      case 'computer_science':
        return 'extracting algorithms, data structures, programming concepts, and their explanations. Pay special attention to diagrams, especially those representing flowcharts, data flow diagrams, or UML diagrams, and their descriptions. Make sure to include any examples or problem-solving methods provided in the study resources, particularly those related to software development, databases, and networking.';
      case 'history':
        return 'extracting historical events, figures, and their significance. Pay special attention to timelines, maps, or primary sources, and their descriptions. Make sure to include any examples or problem-solving methods provided in the study resources, particularly those related to historical analysis, research, and interpretation. Also make a chronological order of every mentioned event, and create a section just for them (after double checking).';
      case 'geography':
        return 'extracting geographical features, regions, and their characteristics. Pay special attention to maps, climate charts, or population graphs, and their descriptions. Make sure to include any examples or problem-solving methods provided in the study resources, particularly those related to geographical analysis, research, and interpretation.';
      case 'literature':
        return 'extracting literary works, authors, and their themes. Pay special attention to quotes, passages, or literary devices, and their explanations. Make sure to include any examples or problem-solving methods provided in the study resources, particularly those related to literary analysis, research, and interpretation.';
      case 'economics':
        return 'extracting economic theories, models, and their applications. Pay special attention to graphs, charts, or case studies, and their descriptions. Make sure to include any examples or problem-solving methods provided in the study resources, particularly those related to microeconomics, macroeconomics, and international trade.';
      case 'psychology':
        return 'extracting psychological theories, experiments, and their implications. Pay special attention to case studies, surveys, or research findings, and their descriptions. Make sure to include any examples or problem-solving methods provided in the study resources, particularly those related to cognitive psychology, social psychology, and abnormal psychology.';
      default:
        return 'extracting information from the study resources';
    }
  }

  async create(createNoteDto: CreateNoteDto, baseId: number) {
    return await db
      .insert(notes)
      .values(createNoteDto)
      .returning({ id: notes.id })
      .execute();
  }

  async breakIntoNotes(generatedText: string) {
    return generatedText.split('# ').map((note) => ({
      title: note.split('\n')[0],
      content: note,
    }));
  }

  async generate(createNoteDto: GenerateNotesDto[], baseId: number) {
    const knowledgeBase = await this.getKnowledgeBaseById(baseId);

    if (!knowledgeBase) {
      throw new Error('Knowledge base not found');
    }

    const prompt = this.getPrompt({
      ...knowledgeBase,
    });

    const schema = {
      description: 'List of notes',
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: {
            type: SchemaType.STRING,
            description: 'Title of the note (in markdown format)',
            nullable: false,
          },
          content: {
            type: SchemaType.STRING,
            description: 'Content of the note (in markdown format)',
            nullable: false,
          },
        },
        required: ['title', 'content'],
      },
    };

    const generation = await this.geminiService.visionGenerateWithUploads(
      prompt,
      createNoteDto,
      schema,
    );

    return generation;
  }

  async createBulkNotes(createNoteDto: CreateNoteDto[], baseId: number) {
    return await db
      .insert(notes)
      .values(createNoteDto)
      .returning({ id: notes.id })
      .execute();
  }

  async fullGenerate(createNoteDto: GenerateNotesDto[], baseId: number) {
    const { text, totalTokens } = await this.generate(createNoteDto, baseId);
    console.log(text, totalTokens);
    const notes = await this.breakIntoNotes(text);

    const action = await this.createBulkNotes(notes, baseId);
    return action;
  }

  async getKnowledgeBaseById(id: number) {
    const knowledgeBase = await this.knowledgeBaseService.findOne(id);

    if (!knowledgeBase.length) {
      throw new Error('Knowledge base not found');
    }

    const [selectedKnowledgeBase] = knowledgeBase;

    return selectedKnowledgeBase;
  }

  async findAll(query: QueryNoteDto) {
    return (await db
      .select({
        id: notes.id,
        title: notes.title,
        amountOfBookmarks: count(bookmarks.id),
        content: notes.content,
      })
      .from(notes)
      .leftJoin(bookmarks, eq(notes.id, bookmarks.itemId))
      .where(
        and(
          query?.title ? ilike(notes.title, `%${query.title}%`) : undefined,
          query?.knowledgeBaseId
            ? eq(notes.knowledgeBaseId, +query.knowledgeBaseId)
            : undefined,
        ),
      )
      .offset(query?.page && query?.limit ? query.page * query.limit - 1 : 0)
      .limit(query?.limit ? query.limit : 10)
      .groupBy(notes.id)
      .execute()) satisfies NoteResponse[];
  }

  async findOne(id: number) {
    return (await db
      .select({
        id: notes.id,
        title: notes.title,
        amountOfBookmarks: count(bookmarks.id),
        content: notes.content,
        userId: knowledgeBase.userId,
        name: users.name,
        profilePicture: users.profilePicture,
        updatedAt: notes.updatedAt,
        knowledgeBaseId: knowledgeBase.id,
        knowledgeBaseTitle: knowledgeBase.title,
      })
      .from(notes)
      .leftJoin(bookmarks, eq(notes.id, bookmarks.itemId))
      .leftJoin(knowledgeBase, eq(notes.knowledgeBaseId, knowledgeBase.id))
      .leftJoin(bookmarks, eq(notes.id, bookmarks.itemId))
      .where(eq(notes.id, id))
      .groupBy(notes.id)) satisfies NoteResponseExtended[];
  }

  async update(id: number, updateNoteDto: UpdateNoteDto) {
    return await db
      .update(notes)
      .set(updateNoteDto)
      .where(eq(notes.id, id))
      .execute();
  }

  async remove(id: number) {
    return await db.delete(notes).where(eq(notes.id, id)).execute();
  }
}
