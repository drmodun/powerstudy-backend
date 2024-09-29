import { Injectable } from '@nestjs/common';
import {
  CreateQuestionAnswerDto,
  WolframInput,
} from './dto/create-question-answer.dto';
import { ResponseSchema, SchemaType } from '@google/generative-ai';
import { GeminiService } from '../../src/gemini/gemini.service';
import { WolframService } from '../../src/wolfram/wolfram.service';
import { db } from '../../src/db/db';
import { questionAnswers } from '../../src/db/schema';
import { QuestionAnswerResponse } from './entities/question-answer.entity';
import { eq } from 'drizzle-orm';

@Injectable()
export class QuestionAnswersService {
  constructor(
    private readonly geminiService: GeminiService,
    private readonly wolframService: WolframService,
  ) {}

  llmPrompt = `This is a very structured response from the wolfram api query, now try to include all information and nicely format it as markdown, make it readable and easy to understand. The information is: `;

  async create(
    createQuestionAnswerDto: CreateQuestionAnswerDto,
    userId: number,
  ) {
    const action = await this.attemptSolveQuestion(
      createQuestionAnswerDto.question,
    );

    const saveObject = {
      question: createQuestionAnswerDto.question,
      answer: action,
      userId,
    };

    const saveAnswer = await db
      .insert(questionAnswers)
      .values(saveObject)
      .returning({ id: questionAnswers.id });

    return saveAnswer;
  }

  async inferLanguage(question: string) {
    const prompt = `Given the question, try to infer the language of the question. The question is: ${question}`;

    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        language: {
          type: SchemaType.STRING,
          description: 'The language of the question',
        },
      },
      required: ['language'],
    } satisfies ResponseSchema;

    const { text } = await this.geminiService.generateText(prompt, schema);
    const parsed = this.attemptLanguageParse(text);
    console.log('language', parsed);

    return parsed;
  }

  attemptLanguageParse(language: string) {
    try {
      const parsed = JSON.parse(language) as { language: string };
      return parsed.language;
    } catch (error) {
      console.error(error);
      return 'english';
    }
  }

  async getRecommendedQuestions(question: string) {
    const prompt =
      'Given the question, try to generate a list of valid wolfram api inputs that are uri encoded for use in the wolfram api calls. Besides the inputs, also output the language you inferred from the question. Also, if the question language is not english, translate it and then generate the inputs (historically better results). For better chances, try to generate at least 5 inputs. The question is: ' +
      question;

    const schema = {
      description: 'List of formatted wolfram api inputs',
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          input: {
            type: SchemaType.STRING,
            description: 'The formatted wolfram api input ',
            example: 'population%20of%20france',
          },
        },
        required: ['input'],
      },
    } satisfies ResponseSchema;

    const { text } = await this.geminiService.generateText(prompt, schema);
    const questions = this.attemptParseQuestions(text);

    console.log('questions', question);

    return questions;
  }

  async getFormattedAnswer(answer: string, language: string) {
    console.log('formatting', language);
    const prompt = `
      ${this.llmPrompt} -output the answer in the ${language} language. Also, no matter the language try using latin letters. The answer information is: " + ${answer}`;

    console.log('prompt', prompt);

    const { text } = await this.geminiService.generateText(prompt);

    return text;
  }

  attemptParseQuestions(question: string) {
    try {
      const parsed = JSON.parse(question) as WolframInput[];
      return parsed;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async attemptCalls(inputs: WolframInput[], language: string = 'english') {
    try {
      for (const { input } of inputs) {
        const response = await this.wolframService.attemptSolveQuestion(input);

        if (response.length == 0) {
          continue;
        }

        const responseText = await this.getFormattedAnswer(
          response,
          language || 'en',
        );

        return responseText;
      }

      throw new Error('No solution found');
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async llmAnswerFallback(question: string) {
    const prompt = `Immediately mention that you are a fallback function and that the wolfram request has failed. Then try to solve the question, use your best knowledge and resources to solve it, and output the solution in markdown format. The question is ${question}`;
    const { text } = await this.geminiService.generateTextPro(prompt);

    return text;
  }

  async attemptSolveQuestion(question: string) {
    const [inputs, language] = await Promise.all([
      this.getRecommendedQuestions(question),
      this.inferLanguage(question),
    ]);
    const response = await this.attemptCalls(inputs, language);

    if (!response) {
      return await this.llmAnswerFallback(question);
    }

    return response;
  }

  async findAll(userId?: number) {
    return (await db
      .select()
      .from(questionAnswers)
      .where(userId ? eq(questionAnswers.userId, userId) : undefined)
      .execute()) satisfies QuestionAnswerResponse[];
  }

  async findOne(id: number) {
    return await db
      .select()
      .from(questionAnswers)
      .where(eq(questionAnswers.id, id))
      .execute();
  }
}
