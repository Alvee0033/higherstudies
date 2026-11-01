import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, IsUrl, Max, Min, MinLength } from 'class-validator';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { DatabaseService } from '../../database/database.service.js';
import { AdminGuard, StaffGuard, type StaffRequest } from '../auth/staff.guard.js';

class CreateSourceDto {
  @IsString() @MinLength(2) name!: string;
  @IsUrl({ require_protocol: true }) baseUrl!: string;
  @IsString() adapter!: string;
  @IsOptional() @IsInt() @Min(1) @Max(8760) refreshHours?: number;
}
class UpdateSourceDto {
  @IsOptional() @IsIn(['pending','approved','blocked','revoked']) permissionStatus?: string;
  @IsOptional() @IsString() permissionNote?: string;
  @IsOptional() @IsBoolean() enabled?: boolean;
  @IsOptional() @IsInt() @Min(1) @Max(8760) refreshHours?: number;
}

@Controller('v1/admin/sources') @UseGuards(StaffGuard)
export class SourcesController {
  constructor(private readonly db: DatabaseService) {}

  @Get()
  async list() { return { data: await this.db.query('SELECT * FROM source ORDER BY created_at DESC LIMIT 100') }; }

  @Post(':id/verify') @UseGuards(AdminGuard)
  async verify(@Param('id') id: string) {
    const rows = await this.db.query<{base_url:string;adapter:string;permission_status:string;enabled:boolean}>('SELECT base_url,adapter,permission_status,enabled FROM source WHERE id=$1', [id]);
    const source = rows[0];
    if (!source) throw new BadRequestException('Unknown source');
    if (source.adapter === 'openalex-authors') {
      const url = new URL('https://api.openalex.org/authors?per_page=1');
      if (process.env.OPENALEX_API_KEY) url.searchParams.set('api_key', process.env.OPENALEX_API_KEY);
      const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new BadRequestException(`OpenAlex returned HTTP ${response.status}. Configure OPENALEX_API_KEY if authentication is required.`);
      await response.body?.cancel();
      return { data: { reachable: true, supported: true, message: 'OpenAlex author API is reachable. Research metadata collection is ready.' } };
    }
    const adapter = await import(pathToFileURL(path.resolve(process.cwd(), 'scripts/faculty-adapter.mjs')).href) as { fetchOfficial: (url: string | URL, signal: AbortSignal) => Promise<string> };
    try {
      await adapter.fetchOfficial(new URL('/robots.txt', source.base_url), AbortSignal.timeout(15000));
      await adapter.fetchOfficial(source.base_url, AbortSignal.timeout(15000));
      return { data: { reachable: true, supported: ['official-faculty','studyportals-search'].includes(source.adapter), message: 'HTTPS source and robots.txt are reachable. Access permission and extracted facts still require review.' } };
    } catch (error) { throw new BadRequestException(error instanceof Error ? error.message : 'Source verification failed'); }
  }

  @Post() @UseGuards(AdminGuard)
  async create(@Body() dto: CreateSourceDto, @Req() req: StaffRequest) {
    const url = new URL(dto.baseUrl);
    if (url.protocol !== 'https:') throw new BadRequestException('HTTPS source required');
    const rows = await this.db.query(`INSERT INTO source(name,base_url,adapter,refresh_hours)
      VALUES($1,$2,$3,$4) RETURNING *`, [dto.name, dto.adapter === 'official-faculty' ? url.toString() : url.origin, dto.adapter, dto.refreshHours ?? 168]);
    await this.db.query(`INSERT INTO audit_event(actor_id,action,entity_type,entity_id) VALUES($1,'create','source',$2)`, [req.staff.id, rows[0].id]);
    return { data: rows[0] };
  }

  @Patch(':id') @UseGuards(AdminGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateSourceDto, @Req() req: StaffRequest) {
    if (dto.enabled && dto.permissionStatus !== 'approved') {
      const current = await this.db.query<{permission_status:string}>('SELECT permission_status FROM source WHERE id=$1', [id]);
      if (current[0]?.permission_status !== 'approved') throw new BadRequestException('Approve permission before enabling source');
    }
    const rows = await this.db.query(`UPDATE source SET permission_status=COALESCE($2,permission_status),
      permission_note=COALESCE($3,permission_note),enabled=COALESCE($4,enabled),
      refresh_hours=COALESCE($5,refresh_hours),updated_at=now() WHERE id=$1 RETURNING *`,
      [id,dto.permissionStatus ?? null,dto.permissionNote ?? null,dto.enabled ?? null,dto.refreshHours ?? null]);
    if (!rows[0]) throw new BadRequestException('Unknown source');
    await this.db.query(`INSERT INTO audit_event(actor_id,action,entity_type,entity_id,metadata) VALUES($1,'update','source',$2,$3)`, [req.staff.id,id,JSON.stringify(dto)]);
    return { data: rows[0] };
  }

  @Delete(':id') @UseGuards(AdminGuard)
  async delete(@Param('id') id: string, @Req() req: StaffRequest) {
    const rows = await this.db.query('DELETE FROM source WHERE id=$1 RETURNING id, name', [id]);
    if (!rows[0]) throw new BadRequestException('Unknown source');
    await this.db.query(`INSERT INTO audit_event(actor_id,action,entity_type,entity_id) VALUES($1,'delete','source',$2)`, [req.staff.id, id]);
    return { data: { success: true, deleted: rows[0] } };
  }
}
