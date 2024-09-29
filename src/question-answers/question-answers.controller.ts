import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuestionAnswersService } from './question-answers.service';
import { CreateQuestionAnswerDto } from './dto/create-question-answer.dto';
import { UpdateQuestionAnswerDto } from './dto/update-question-answer.dto';

@Controller('question-answers')
export class QuestionAnswersController {
  constructor(private readonly questionAnswersService: QuestionAnswersService) {}

  @Post()
  create(@Body() createQuestionAnswerDto: CreateQuestionAnswerDto) {
    return this.questionAnswersService.create(createQuestionAnswerDto);
  }

  @Get()
  findAll() {
    return this.questionAnswersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionAnswersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuestionAnswerDto: UpdateQuestionAnswerDto) {
    return this.questionAnswersService.update(+id, updateQuestionAnswerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionAnswersService.remove(+id);
  }
}
