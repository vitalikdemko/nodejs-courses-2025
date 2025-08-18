import { Controller, Get, Post, Put, Delete, Param, Query, DefaultValuePipe, ParseFloatPipe } from '@nestjs/common';
import { TeaService } from './tea.service';
import { CreateTeaDto, TeaListQuerySchema, TeaSchema, UpdateTeaDto } from './tea.dto';
import { ZBody } from '../common/decorators/z-body.decorator';
import { Public } from '../common/decorators/public.decorator';
import { RateLimit } from '../common/decorators/rate-limit.decorator';
import { ApiBody, ApiOkResponse, ApiQuery, ApiSecurity } from '@nestjs/swagger';

@ApiSecurity('x-api-key')
@Controller('tea')
export class TeaController {
  constructor(private readonly teaService: TeaService) {}

  @Get()
  @Public()
  @ApiQuery({ name: 'minRating', required: false, type: Number, example: 7 })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiOkResponse({
    description: 'Paginated teas',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { type: 'object' } },
        total: { type: 'number' },
        page: { type: 'number' },
        pageSize: { type: 'number' },
      },
    },
  })
  getAll(@Query() q: any) {
    const parsed = TeaListQuerySchema.parse(q);
    return this.teaService.findAll(parsed);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.teaService.findOne(id);
  }

  @Post()
  @RateLimit(10)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 3, maxLength: 40 },
        origin: { type: 'string', minLength: 2, maxLength: 30 },
        rating: { type: 'number', minimum: 1, maximum: 10 },
        brewTemp: { type: 'number', minimum: 60, maximum: 100 },
        notes: { type: 'string', maxLength: 150 },
      },
      required: ['name', 'origin'],
    },
  })
  create(@ZBody(TeaSchema) dto: CreateTeaDto) {
    return this.teaService.create(dto);
  }

  @Put(':id')
  @ApiBody({
    description: 'Partial update of tea',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 3, maxLength: 40 },
        origin: { type: 'string', minLength: 2, maxLength: 30 },
        rating: { type: 'integer', minimum: 1, maximum: 10 },
        brewTemp: { type: 'number', minimum: 60, maximum: 100 },
        notes: { type: 'string', maxLength: 150 },
      },
      required: [],
      additionalProperties: false,
    },
  })
  update(@Param('id') id: string, @ZBody(TeaSchema.partial()) dto: UpdateTeaDto) {
    return this.teaService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teaService.delete(id);
  }
}
