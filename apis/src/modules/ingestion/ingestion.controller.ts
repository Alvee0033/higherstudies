import { BadRequestException, Body, Controller, ForbiddenException, Post, Req, UnauthorizedException } from '@nestjs/common';
import { IsArray, IsIn, IsObject, IsOptional, IsString, IsUrl, IsUUID, MaxLength, MinLength, ValidateNested, ArrayMaxSize } from 'class-validator';
import { Type } from 'class-transformer';
import { createHash, timingSafeEqual } from 'node:crypto';
import type { FastifyRequest } from 'fastify';
import { publishResearchMetadata, publishInstitutionRegistryMetadata } from './research-publication.js';
import { DatabaseService } from '../../database/database.service.js';

const recordTypes = ['institution','programme','requirement_claim','funding_opportunity','faculty_member'] as const;

class ItemDto {
  @IsOptional() @IsString() @MaxLength(300) externalId?: string;
  @IsUrl({ require_protocol: true }) sourceUrl!: string;
  @IsObject() payload!: Record<string, unknown>;
}

class BatchDto {
  @IsIn([1]) schemaVersion!: number;
  @IsUUID() sourceId!: string;
  @IsOptional() @IsUUID() runId?: string;
  @IsString() @MinLength(8) @MaxLength(200) idempotencyKey!: string;
  @IsIn(recordTypes) recordType!: typeof recordTypes[number];
  @IsArray() @ArrayMaxSize(100) @ValidateNested({ each: true }) @Type(() => ItemDto) items!: ItemDto[];
}

export class DirectIntakeDto {
  @IsOptional() @IsString() term?: string;
  @IsOptional() @IsString() startsOn?: string;
  @IsOptional() @IsString() deadlineOn?: string;
  @IsOptional() @IsString() applicationUrl?: string;
}

export class DirectRequirementDto {
  @IsString() type!: string;
  @IsIn(['required', 'optional', 'waived', 'not_accepted', 'unknown']) state!: string;
  @IsOptional() @IsString() valueText?: string;
  @IsOptional() valueNumber?: number | string;
  @IsOptional() @IsString() unit?: string;
  @IsOptional() @IsString() conditionText?: string;
}

export class DirectProgrammeItemDto {
  @IsString() @MinLength(2) @MaxLength(300) institutionName!: string;
  @IsOptional() @IsString() institutionOfficialUrl?: string;
  @IsString() @MinLength(2) @MaxLength(2) countryCode!: string;
  @IsOptional() @IsString() city?: string;
  @IsString() @MinLength(2) @MaxLength(300) title!: string;
  @IsIn(['masters', 'phd']) degree!: 'masters' | 'phd';
  @IsOptional() @IsString() officialUrl?: string;
  @IsOptional() @IsString() discoveryUrl?: string;
  @IsOptional() @IsString() language?: string;
  @IsOptional() @IsString() academicUnit?: string;
  @IsOptional() @IsIn(['open', 'paused_external', 'closed', 'unknown']) applicationStatus?: string;
  @IsOptional() @IsString() admissionNote?: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => DirectIntakeDto) intakes?: DirectIntakeDto[];
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => DirectRequirementDto) requirements?: DirectRequirementDto[];
}

export class IngestProgrammesBatchDto {
  @IsArray() @ArrayMaxSize(200) @ValidateNested({ each: true }) @Type(() => DirectProgrammeItemDto) items!: DirectProgrammeItemDto[];
}

export class DirectInstitutionItemDto {
  @IsString() @MinLength(2) @MaxLength(300) name!: string;
  @IsString() @MinLength(2) @MaxLength(2) countryCode!: string;
  @IsOptional() @IsString() city?: string;
  @IsString() officialUrl!: string;
  @IsOptional() @IsString() rorId?: string;
  @IsOptional() @IsString() openAlexId?: string;
}

export class IngestInstitutionsBatchDto {
  @IsArray() @ArrayMaxSize(500) @ValidateNested({ each: true }) @Type(() => DirectInstitutionItemDto) items!: DirectInstitutionItemDto[];
}

export class DirectFacultyItemDto {
  @IsString() @MinLength(2) @MaxLength(300) institutionName!: string;
  @IsString() @MinLength(2) @MaxLength(300) name!: string;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() academicUnit?: string;
  @IsString() officialProfileUrl!: string;
  @IsOptional() @IsString() publicEmail?: string;
  @IsOptional() @IsArray() researchTopics?: string[];
}

export class IngestFacultyBatchDto {
  @IsArray() @ArrayMaxSize(200) @ValidateNested({ each: true }) @Type(() => DirectFacultyItemDto) items!: DirectFacultyItemDto[];
}

@Controller('v1/internal/ingestion')
export class IngestionController {
  constructor(private readonly db: DatabaseService) {}

  private verifyAuth(req: FastifyRequest) {
    const expected = process.env.INTERNAL_INGEST_SECRET;
    const supplied = req.headers['x-internal-key'] as string | undefined;
    if (!expected || !supplied) throw new UnauthorizedException('Missing x-internal-key header');
    const a = Buffer.from(createHash('sha256').update(expected).digest());
    const b = Buffer.from(createHash('sha256').update(supplied).digest());
    if (!timingSafeEqual(a, b)) throw new UnauthorizedException('Invalid x-internal-key');
  }

  // 1. Raw Staging Ingestion Batch Endpoint (for review queue)
  @Post('batches')
  async ingest(@Body() dto: BatchDto, @Req() req: FastifyRequest) {
    this.verifyAuth(req);
    const sourceRows = await this.db.query<{base_url:string;adapter:string;permission_status:string;enabled:boolean}>('SELECT base_url,adapter,permission_status,enabled FROM source WHERE id=$1', [dto.sourceId]);
    const source = sourceRows[0];
    if (!source || source.permission_status !== 'approved' || !source.enabled) throw new ForbiddenException('Source not approved or disabled');
    const sourceHost = new URL(source.base_url).hostname;
    for (const item of dto.items) {
      const url = new URL(item.sourceUrl);
      const sourceMatches = url.hostname === sourceHost || url.hostname.endsWith(`.${sourceHost}`);
      const studyportalsListing = source.adapter === 'studyportals-search' && ['www.mastersportal.com','www.phdportal.com'].includes(url.hostname);
      if (url.protocol !== 'https:' || (!sourceMatches && !studyportalsListing)) throw new BadRequestException('Item URL outside source domain');
    }
    return this.db.transaction(async (client) => {
      if (dto.runId) {
        const job = await client.query<{status:string;source_id:string}>('SELECT status,source_id FROM crawl_job WHERE id=$1 FOR UPDATE', [dto.runId]);
        if (job.rows[0]?.status !== 'running' || job.rows[0]?.source_id !== dto.sourceId) throw new ForbiddenException('Collection job is stopped or does not match source');
      }
      const existing = await client.query('SELECT result FROM ingestion_batch WHERE source_id=$1 AND idempotency_key=$2', [dto.sourceId,dto.idempotencyKey]);
      if (existing.rows[0]) return existing.rows[0].result;
      let accepted = 0;
      let unchanged = 0;
      for (const item of dto.items) {
        const contentHash = createHash('sha256').update(JSON.stringify(item.payload)).digest('hex');
        const match = await client.query(`SELECT id,content_hash,review_state FROM staged_record WHERE source_id=$1 AND record_type=$2 AND ${item.externalId ? 'external_id=$3' : 'source_url=$3'}`,
          [dto.sourceId,dto.recordType,item.externalId ?? item.sourceUrl]);
        if (match.rows[0]?.content_hash === contentHash) {
          if (source.adapter === 'openalex-authors' && dto.recordType === 'faculty_member' && match.rows[0].review_state === 'needs_review') await publishResearchMetadata(client, dto.sourceId, match.rows[0].id as string, item.sourceUrl, item.payload);
          unchanged++; continue;
        }
        if (match.rows[0]) {
          await client.query(`UPDATE staged_record SET payload=$2,content_hash=$3,source_url=$4,review_state='needs_review',version=version+1,updated_at=now() WHERE id=$1`,
            [match.rows[0].id,JSON.stringify(item.payload),contentHash,item.sourceUrl]);
        } else {
          await client.query(`INSERT INTO staged_record(source_id,job_id,record_type,external_id,source_url,payload,content_hash)
            VALUES($1,$2,$3,$4,$5,$6,$7)`, [dto.sourceId,dto.runId ?? null,dto.recordType,item.externalId ?? null,item.sourceUrl,JSON.stringify(item.payload),contentHash]);
        }
        if (source.adapter === 'openalex-authors' && dto.recordType === 'faculty_member') {
          const staged = await client.query<{id:string}>('SELECT id FROM staged_record WHERE source_id=$1 AND record_type=$2 AND external_id=$3', [dto.sourceId,dto.recordType,item.externalId]);
          await publishResearchMetadata(client, dto.sourceId, staged.rows[0].id, item.sourceUrl, item.payload);
        } else if(source.adapter === 'openalex-authors' && dto.recordType === 'institution') {
          const staged=await client.query<{id:string}>('SELECT id FROM staged_record WHERE source_id=$1 AND record_type=$2 AND external_id=$3',[dto.sourceId,dto.recordType,item.externalId]);
          await publishInstitutionRegistryMetadata(client,dto.sourceId,staged.rows[0].id,item.sourceUrl,item.payload);
        }
        accepted++;
      }
      const result = { accepted, unchanged, rejected: 0, errors: [] };
      await client.query('INSERT INTO ingestion_batch(source_id,idempotency_key,result) VALUES($1,$2,$3)', [dto.sourceId,dto.idempotencyKey,JSON.stringify(result)]);
      return result;
    });
  }

  // 2. Direct Canonical Programme Ingestion API (Professional API for verified scrapers)
  @Post('programmes')
  async ingestProgrammes(@Body() dto: IngestProgrammesBatchDto, @Req() req: FastifyRequest) {
    this.verifyAuth(req);
    void dto;
    throw new ForbiddenException('Direct publication is disabled. Submit source-backed records to POST /v1/internal/ingestion/batches for review.');
  }

  // 3. Direct Canonical Institution Ingestion API
  @Post('institutions')
  async ingestInstitutions(@Body() dto: IngestInstitutionsBatchDto, @Req() req: FastifyRequest) {
    this.verifyAuth(req);
    void dto;
    throw new ForbiddenException('Direct publication is disabled. Submit source-backed records to POST /v1/internal/ingestion/batches for review.');
  }

  // 4. Direct Canonical Faculty Ingestion API
  @Post('faculty')
  async ingestFaculty(@Body() dto: IngestFacultyBatchDto, @Req() req: FastifyRequest) {
    this.verifyAuth(req);
    void dto;
    throw new ForbiddenException('Direct publication is disabled. Submit source-backed records to POST /v1/internal/ingestion/batches for review.');
  }
}
