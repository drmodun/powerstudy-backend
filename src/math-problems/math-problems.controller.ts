import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UploadedFiles,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { MathProblemsService } from './math-problems.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { MathProblemResponse } from './entities/math-problem.entity';
import { BaseActionReturn } from 'src/base/baseActionReturn';

@ApiTags('math-problems')
@Controller('math-problems')
export class MathProblemsController {
  constructor(private readonly mathProblemsService: MathProblemsService) {}

  @Post(':id')
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: BaseActionReturn })
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async uploadImage(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/*' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('id')
    id: string,
  ) {
    const action = await this.mathProblemsService.create(file, +id);

    return action[0];
  }

  @Get()
  @ApiOkResponse({ type: [MathProblemResponse] })
  async findAll() {
    return await this.mathProblemsService.findAll();
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [MathProblemResponse] })
  @ApiBearerAuth()
  async findAllForUser(@Req() { user }) {
    return this.mathProblemsService.findAll(user.id);
  }

  @Get(':id')
  @ApiOkResponse({ type: MathProblemResponse })
  async findOne(@Param('id') id: string) {
    return await this.mathProblemsService.findOne(+id);
  }

  @Delete(':id')
  @ApiOkResponse({ type: BaseActionReturn })
  async remove(@Param('id') id: string) {
    const action = await this.mathProblemsService.remove(+id);

    return action[0];
  }
}
