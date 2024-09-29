import { Injectable } from '@nestjs/common';
import { UpdateMathProblemDto } from './dto/update-math-problem.dto';
import { GeminiService } from 'src/gemini/gemini.service';
import { WolframService } from 'src/wolfram/wolfram.service';
import db from 'src/db';
import { mathProblems } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class MathProblemsService {
  constructor(
    private readonly geminiService: GeminiService,
    private readonly wolframService: WolframService,
  ) {}

  async create(createMathProblemDto: Express.Multer.File, userId: number) {
    const { action: problem, result: solution } =
      await this.tryToSolveProblemFromImage(createMathProblemDto);

    return await this.saveToDatabase(problem, solution.toString(), userId);
  }

  async saveToDatabase(problem: string, solution: string, userId: number) {
    return await db
      .insert(mathProblems)
      .values({
        mathQuestion: problem,
        solution,
        difficulty: 'high', // TODO implement if needed
        userId,
      })
      .returning({ id: mathProblems.id });
  }

  async extractProblemFromImage(image: Express.Multer.File) {
    const prompt =
      'Extract the math problem from the image, try to use your vision as best as possible, and only try to extract the math problem, dont solve it. Also output it fully in latex format';

    const { text } = await this.geminiService.visionGenerate(prompt, image);
    console.log(text);
    return text;
  }

  async fallBackSolver(problem: string) {
    const prompt = `Immediately mention that you are a fallback function and that the wolfram request has failed. Then try to solve the math problem, use your best knowledge and resources to solve it, and output the solution in markdown format. Try to solve it step by step. The problem is ${problem}`;
    const { text } = await this.geminiService.generateTextPro(prompt);

    return text;
  }

  async tryToSolveProblemFromImage(image: Express.Multer.File) {
    const action = await this.extractProblemFromImage(image);
    const result = await this.wolframService.solveMathProblem(action);

    if (result.length === 0) {
      return { action, result: await this.fallBackSolver(action) };
    }

    const explanationPrompt = `Explain the solution to the math problem in markdown format. The problem is ${action}, and the solution is represented by this object ${JSON.stringify(result)}. Try to explain it step by step, and be sure to output it in clean markdown format.`;
    const { text: explanation } =
      await this.geminiService.generateText(explanationPrompt);

    return { action, explanation };
  }

  async findAll(userId?: number) {
    return await db
      .select({
        id: mathProblems.id,
        updatedAt: mathProblems.updatedAt,
        mathQuestion: mathProblems.mathQuestion,
        solution: mathProblems.solution,
        userId: mathProblems.userId,
      })
      .from(mathProblems)
      .where(userId ? eq(mathProblems.userId, userId) : undefined)
      .execute();
  }

  async findOne(id: number) {
    return await db
      .select({
        id: mathProblems.id,
        mathQuestion: mathProblems.mathQuestion,
        solution: mathProblems.solution,
        updatedAt: mathProblems.updatedAt,
        userId: mathProblems.userId,
      })
      .from(mathProblems)
      .where(eq(mathProblems.id, id))
      .execute();
  }

  update(id: number, updateMathProblemDto: UpdateMathProblemDto) {
    return `This action updates a #${id} mathProblem`;
  }

  async remove(id: number) {
    return await db
      .delete(mathProblems)
      .where(eq(mathProblems.id, id))
      .execute();
  }
}
