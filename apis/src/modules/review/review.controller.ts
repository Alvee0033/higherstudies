import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, Req, UseGuards, HttpException } from '@nestjs/common';
import { IsIn, IsInt, IsOptional, IsString, Min, IsArray, ArrayMinSize, ArrayMaxSize, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { Throttle } from '@nestjs/throttler';
import { ReviewService } from './review.service.js';
import { StaffGuard, type StaffRequest } from '../auth/staff.guard.js';

class DecisionDto {
  @IsIn(['approve','reject']) decision!: 'approve'|'reject';
  @IsInt() @Min(1) expectedVersion!: number;
  @IsOptional() @IsString() reason?: string;
}

class BulkItemDto {
  @IsUUID() id!: string;
  @IsInt() @Min(1) expectedVersion!: number;
}
class BulkDecisionDto {
  @IsIn(['approve','reject']) decision!: 'approve'|'reject';
  @IsOptional() @IsString() reason?: string;
  @IsArray() @ArrayMinSize(1) @ArrayMaxSize(25) @ValidateNested({each:true}) @Type(()=>BulkItemDto) items!: BulkItemDto[];
}

@Controller('v1/admin/review-items') @UseGuards(StaffGuard)
export class ReviewController {
  constructor(private readonly review: ReviewService) {}
  @Get() list(@Query('state') state?: string, @Query('limit') limit?: string, @Query('offset') offset?: string, @Query('recordType') recordType?: string) {
    return this.review.list(state, limit ? Number(limit) : 30, offset ? Number(offset) : 0, recordType);
  }
  @Get('selection') @Throttle({default:{limit:300,ttl:60000}})
  selection(@Query('recordType') recordType?:string,@Query('q') q?:string,@Query('cursor') cursor?:string,@Query('before') before?:string,@Query('limit') limit?:string) {return this.review.selection(recordType,q,cursor,before,limit ? Number(limit) : 1000);}
  @Get(':id') detail(@Param('id',ParseUUIDPipe) id: string) { return this.review.detail(id); }
  @Post('bulk-decisions') @Throttle({default:{limit:300,ttl:60000}})
  async bulk(@Body() dto:BulkDecisionDto,@Req() req:StaffRequest) {
    const data:Array<{id:string;success:boolean;error?:string}>=[];
    for(const item of dto.items) {
      try {await this.review.decide(item.id,req.staff.id,dto.decision,item.expectedVersion,dto.reason);data.push({id:item.id,success:true});}
      catch(cause){data.push({id:item.id,success:false,error:cause instanceof HttpException ? cause.message : 'Could not publish this record'});}
    }
    return {data};
  }
  @Post(':id/decisions') decide(@Param('id',ParseUUIDPipe) id: string, @Body() dto: DecisionDto, @Req() req: StaffRequest) {
    return this.review.decide(id,req.staff.id,dto.decision,dto.expectedVersion,dto.reason);
  }
}
