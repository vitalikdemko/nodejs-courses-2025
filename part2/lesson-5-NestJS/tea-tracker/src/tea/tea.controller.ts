import { Controller, Get, Post, Put, Delete, Param, Query } from '@nestjs/common';
import { TeaService } from './tea.service';
import { CreateTeaDto, TeaSchema, UpdateTeaDto } from './tea.dto';
import { ZBody } from '../common/decorators/z-body.decorator';
import { Public } from '../common/decorators/public.decorator';
import { RateLimit } from '../common/decorators/rate-limit.decorator';
import { ApiBody } from '@nestjs/swagger';

@Controller('tea')
export class TeaController {
  constructor(private readonly teaService: TeaService) {}

  @Get()
  @Public()
  getAll(@Query('minRating') minRating: string) {
    return this.teaService.findAll(Number(minRating) || 1);
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
  update(@Param('id') id: string, @ZBody(TeaSchema.partial()) dto: UpdateTeaDto) {
    return this.teaService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teaService.delete(id);
  }
}
