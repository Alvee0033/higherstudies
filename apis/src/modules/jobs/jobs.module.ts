import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { JobsController } from './jobs.controller.js';
import { JobsService } from './jobs.service.js';
import { AutopilotScheduler } from './autopilot.scheduler.js';
@Module({
  imports: [AuthModule],
  controllers: [JobsController],
  providers: [JobsService, AutopilotScheduler],
})
export class JobsModule {}
