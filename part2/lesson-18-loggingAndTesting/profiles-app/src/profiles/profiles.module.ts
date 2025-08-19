import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { AppLogger } from '../common/logger.service';
import { AuthGuard } from '../common/auth.guard';

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService, AppLogger, AuthGuard],
  exports: [AppLogger],
})
export class ProfilesModule {}
