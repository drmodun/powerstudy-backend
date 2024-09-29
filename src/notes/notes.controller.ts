import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import {
  CreateNoteDto,
  FullGenerateNotesDto,
  GenerateNotesDto,
} from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../src/auth/jwt-auth-guard';
import { KnowledgeBaseOwnerGuard } from '../../src/auth/knowledge-base-guard';
import { QueryNoteDto } from './dto/query-note.dto';
import { BaseActionReturn } from '../../src/base/baseActionReturn';
import { NoteResponse, NoteResponseExtended } from './entities/note.entity';

@ApiTags('notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @UseGuards(JwtAuthGuard, KnowledgeBaseOwnerGuard)
  @ApiBearerAuth()
  @Post(':baseId')
  @ApiCreatedResponse({ type: BaseActionReturn })
  async generate(
    @Body() generateNotesDto: FullGenerateNotesDto,
    @Param('baseId') baseId: string,
  ) {
    return this.notesService.fullGenerate(generateNotesDto.notes, +baseId);
  }

  @Get()
  @ApiOkResponse({ type: [NoteResponse] })
  async findAll(@Query() query?: QueryNoteDto) {
    return await this.notesService.findAll(query);
  }

  @Get(':noteId')
  @ApiOkResponse({ type: NoteResponseExtended })
  async findOne(@Param('noteId') id: string) {
    const result = await this.notesService.findOne(+id);

    return result[0];
  }

  @UseGuards(JwtAuthGuard, KnowledgeBaseOwnerGuard)
  @ApiOkResponse({ type: BaseActionReturn })
  @ApiBearerAuth()
  @Patch(':baseId/:noteId')
  async update(
    @Param('noteId') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    const action = this.notesService.update(+id, updateNoteDto);

    return action[0];
  }

  @UseGuards(JwtAuthGuard, KnowledgeBaseOwnerGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: BaseActionReturn })
  @Delete(':baseId/:noteId')
  async remove(@Param('id') id: string) {
    const action = await this.notesService.remove(+id);

    return action[0];
  }
}
