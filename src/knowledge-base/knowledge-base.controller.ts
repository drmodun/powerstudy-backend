import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { BaseActionReturn } from 'src/base/baseActionReturn';
import { KnowledgeBasesService } from './knowledge-base.service';
import { CreateKnowledgeBaseDto } from './dto/create-knowledge-base.dto';
import { KnowledgeBaseResponse } from './entities/knowledge-base.entity';
import { UpdateKnowledgeBaseDto } from './dto/update-knowledge-base.dto';
import { KnowledgeBaseOwnerGuard } from 'src/auth/knowledge-base-guard';
import { KnowledgeBaseQuery } from './dto/query-knowledge-base.dto';

@ApiTags('knowledge-bases')
@Controller('knowledge-bases')
export class KnowledgeBasesController {
  constructor(private readonly knowledgeBaseService: KnowledgeBasesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: BaseActionReturn })
  async create(
    @Body() createKnowledgeBaseDto: CreateKnowledgeBaseDto,
    @Req() { user },
  ) {
    const action = await this.knowledgeBaseService.create(
      createKnowledgeBaseDto,
      user.id,
    );

    return action[0];
  }

  @Get()
  @ApiOkResponse({ type: [KnowledgeBaseResponse] })
  async findAll(@Query() query: KnowledgeBaseQuery) {
    return await this.knowledgeBaseService.findAll(query);
  }

  @Patch(':baseId')
  @UseGuards(JwtAuthGuard, KnowledgeBaseOwnerGuard)
  @ApiOkResponse({ type: BaseActionReturn })
  @ApiBearerAuth()
  async update(
    @Body() updateKnowledgeBaseDto: UpdateKnowledgeBaseDto,
    @Param('baseId') id: string,
  ) {
    const action = await this.knowledgeBaseService.update(
      +id,
      updateKnowledgeBaseDto,
    );

    return action[0];
  }

  @Delete(':baseId')
  @UseGuards(JwtAuthGuard, KnowledgeBaseOwnerGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: BaseActionReturn })
  async remove(@Param('baseId') id: string) {
    const action = await this.knowledgeBaseService.remove(+id);

    return action[0];
  }

  @Get(':baseId')
  @ApiOkResponse({ type: KnowledgeBaseResponse })
  async findOne(@Param('baseId') id: string) {
    const action = await this.knowledgeBaseService.findOne(+id);

    return action[0];
  }
}
