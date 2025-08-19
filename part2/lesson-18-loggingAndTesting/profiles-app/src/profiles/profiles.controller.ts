import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { AppLogger } from '../common/logger.service';
import { AuthGuard } from '../common/auth.guard';

@Controller('profiles')
export class ProfilesController {
  constructor(private svc: ProfilesService, private logger: AppLogger) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() dto: CreateProfileDto) {
    const created = this.svc.create(dto);
    this.logger.log('profile.created', { id: created.id, email: created.email });
    return created;
  }

  @Get(':id')
  find(@Param('id') id: string) {
    return this.svc.findById(id);
  }
}
