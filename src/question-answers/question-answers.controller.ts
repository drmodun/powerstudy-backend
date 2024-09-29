import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { QuestionAnswersService } from './question-answers.service';
import { CreateQuestionAnswerDto } from './dto/create-question-answer.dto';
import { JwtAuthGuard } from '../../src/auth/jwt-auth-guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BaseActionReturn } from '../../src/base/baseActionReturn';
import { QuestionAnswerResponse } from './entities/question-answer.entity';

@ApiTags('question-answers')
@Controller('question-answers')
export class QuestionAnswersController {
  constructor(
    private readonly questionAnswersService: QuestionAnswersService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: BaseActionReturn,
  })
  async create(
    @Body() createQuestionAnswerDto: CreateQuestionAnswerDto,
    @Req() { user },
  ) {
    const action = await this.questionAnswersService.create(
      createQuestionAnswerDto,
      user.id,
    );

    return action[0];
  }

  @Get()
  @ApiOkResponse({
    type: [QuestionAnswerResponse],
  })
  async findAll() {
    return await this.questionAnswersService.findAll();
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: [QuestionAnswerResponse],
  })
  async findMe(@Req() { user }) {
    return await this.questionAnswersService.findAll(user.id);
  }

  @Get(':id')
  @ApiOkResponse({
    type: QuestionAnswerResponse,
  })
  async findOne(@Param('id') id: string) {
    const action = await this.questionAnswersService.findOne(+id);

    return action[0];
  }
}
