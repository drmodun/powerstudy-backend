import { PartialType } from '@nestjs/swagger';
import { CreateMathProblemDto } from './create-math-problem.dto';

export class UpdateMathProblemDto extends PartialType(CreateMathProblemDto) {}
