import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { StudentEmailTrackerController } from './student-email-tracker.controller.js';
import { StudentEmailTrackerService } from './student-email-tracker.service.js';

@Module({
  imports: [AuthModule],
  controllers: [StudentEmailTrackerController],
  providers: [StudentEmailTrackerService],
})
export class StudentEmailTrackerModule {}
