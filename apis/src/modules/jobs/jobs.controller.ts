import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import {
  AdminGuard,
  StaffGuard,
  type StaffRequest,
} from '../auth/staff.guard.js';
import { JobsService } from './jobs.service.js';

class QueueJobDto {
  @IsOptional() @IsInt() @Min(2) @Max(60) requestIntervalSeconds?: number;
  @IsOptional() @IsInt() @Min(100) @Max(5000) restEveryRecords?: number;
  @IsOptional() @IsInt() @Min(30) @Max(3600) restSeconds?: number;
  @IsOptional() @IsIn(['all','programmes','faculty']) target?: 'all' | 'programmes' | 'faculty';
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsUUID('4', { each: true })
  sourceIds?: string[];
  @IsIn(['shallow', 'medium', 'deep']) depth!: 'shallow' | 'medium' | 'deep';
  @IsIn(['discovery', 'refresh', 'full']) mode!:
    'discovery' | 'refresh' | 'full';
}

class UpdateAutopilotDto {
  @IsBoolean() enabled!: boolean;
  @IsIn([1, 3, 6, 12, 24, 48, 168]) intervalHours!: number;
  @IsBoolean() triggerOnSchedule!: boolean;
  @IsBoolean() triggerOnSourceEnabled!: boolean;
  @IsBoolean() onlyDueSources!: boolean;
  @IsArray()
  @ArrayMaxSize(20)
  @IsUUID('4', { each: true })
  sourceIds!: string[];
  @IsInt() @Min(1) @Max(20) maxSourcesPerRun!: number;
  @IsIn(['shallow', 'medium', 'deep']) depth!: 'shallow' | 'medium' | 'deep';
  @IsIn(['discovery', 'refresh', 'full']) mode!:
    'discovery' | 'refresh' | 'full';
}

@Controller('v1/admin/jobs')
@UseGuards(StaffGuard)
export class JobsController {
  constructor(private readonly jobs: JobsService) {}
  @Get() list() {
    return this.jobs.list();
  }
  @Get('autopilot') async autopilot() {
    return { data: await this.jobs.getAutopilot() };
  }
  @Post('worker/start') @UseGuards(AdminGuard) async startWorker() {
    return { data: await this.jobs.ensureWorker() };
  }
  @Put('autopilot') @UseGuards(AdminGuard) updateAutopilot(
    @Body() dto: UpdateAutopilotDto,
    @Req() req: StaffRequest,
  ) {
    return this.jobs
      .updateAutopilot(dto, req.staff.id)
      .then((result) => ({ data: result }));
  }
  @Post() @UseGuards(AdminGuard) queue(
    @Body() dto: QueueJobDto,
    @Req() req: StaffRequest,
  ) {
    return this.jobs.queue(dto, req.staff.id);
  }
  @Get(':id/preview') preview(@Param('id') id: string) { return this.jobs.preview(id); }
  @Post(':id/cancel') @UseGuards(AdminGuard) cancel(
    @Param('id') id: string,
    @Req() req: StaffRequest,
  ) {
    return this.jobs.cancel(id, req.staff.id);
  }
}
