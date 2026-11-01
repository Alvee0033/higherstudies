import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StudentGuard, type StudentRequest } from '../auth/student.guard.js';
import {
  CreateEmailTrackerDto,
  UpdateEmailTrackerDto,
} from './student-email-tracker.dto.js';
import { StudentEmailTrackerService } from './student-email-tracker.service.js';

@Controller('v1/student/email-tracker')
@UseGuards(StudentGuard)
export class StudentEmailTrackerController {
  constructor(private readonly tracker: StudentEmailTrackerService) {}

  @Get()
  list(
    @Req() req: StudentRequest,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.tracker.list(req.student.id, limit, offset);
  }

  @Post()
  create(@Req() req: StudentRequest, @Body() dto: CreateEmailTrackerDto) {
    return this.tracker.create(req.student.id, dto);
  }

  @Patch(':id')
  update(
    @Req() req: StudentRequest,
    @Param('id') id: string,
    @Body() dto: UpdateEmailTrackerDto,
  ) {
    return this.tracker.update(req.student.id, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: StudentRequest, @Param('id') id: string) {
    return this.tracker.remove(req.student.id, id);
  }
}
