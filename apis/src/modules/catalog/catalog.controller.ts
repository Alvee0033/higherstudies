import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { IsUUID, IsUrl } from 'class-validator';
import { DatabaseService } from '../../database/database.service.js';
import { createHash } from 'node:crypto';
import { Throttle } from '@nestjs/throttler';
import { CatalogService } from './catalog.service.js';
import { StaffGuard, type StaffRequest } from '../auth/staff.guard.js';

class ContactJobDto {
 @IsUUID() sourceId!: string;
 @IsUrl({protocols:['https'],require_protocol:true}) profileUrl!: string;
}

@Controller('v1')
export class CatalogController {
  constructor(private readonly catalog: CatalogService, private readonly db: DatabaseService) {}
  @Get('catalog/summary') summary() { return this.catalog.summary(); }
  @Get('admin/catalog/summary') @UseGuards(StaffGuard)
  adminSummary() { return this.catalog.summary(true); }
  @Get('institutions') institutions(@Query() q: Record<string,string>) { return this.catalog.list('institutions', q); }
  @Get('institutions/facets') publicInstitutionFacets() { return this.catalog.catalogueFacets('institutions'); }
  @Get('institutions/:id') institution(@Param('id') id: string) { return this.catalog.detail('institutions', id); }
  @Get('programmes') programmes(@Query() q: Record<string,string>) { return this.catalog.list('programmes', q); }
  @Get('programmes/facets') publicProgrammeFacets() { return this.catalog.catalogueFacets('programmes'); }
  @Get('programmes/:id') programme(@Param('id') id: string) { return this.catalog.detail('programmes', id); }
  @Get('funding') funding(@Query() q: Record<string,string>) { return this.catalog.list('funding', q); }
  @Get('funding/:id') fundingDetail(@Param('id') id: string) { return this.catalog.detail('funding', id); }
  @Get('admin/catalog/faculty') @UseGuards(StaffGuard) @Throttle({default:{limit:300,ttl:60000}})
  adminFaculty(@Query() q: Record<string,string>) { return this.catalog.list('faculty',q,true); }
  @Get('admin/catalog/faculty/facets') @UseGuards(StaffGuard)
  facultyFacets() { return this.catalog.catalogueFacets('faculty', true); }
  @Get('admin/catalog/programmes') @UseGuards(StaffGuard) @Throttle({default:{limit:300,ttl:60000}})
  adminProgrammes(@Query() q:Record<string,string>) {return this.catalog.list('programmes',q,true);}
  @Get('admin/catalog/programmes/facets') @UseGuards(StaffGuard)
  programmeFacets() {return this.catalog.catalogueFacets('programmes', true);}
  @Get('faculty') faculty(@Query() q: Record<string,string>) { return this.catalog.list('faculty', q); }
  @Get('faculty/facets') publicFacultyFacets() { return this.catalog.catalogueFacets(); }
  @Get('faculty/:id') facultyDetail(@Param('id') id: string) { return this.catalog.detail('faculty', id); }

  @Post('admin/catalog/faculty/:id/contact-jobs')
  @UseGuards(StaffGuard)
  @Throttle({default:{limit:10,ttl:60000}})
  async contactJob(@Param('id') id:string,@Body() body:ContactJobDto,@Req() req:StaffRequest) {
    const faculty=await this.catalog.detail('faculty',id);
    if(!faculty.data)throw new BadRequestException('Unknown faculty member');
    const sources=await this.db.query<{base_url:string}>(`SELECT base_url FROM source WHERE id=$1 AND adapter='official-faculty' AND enabled=true AND permission_status='approved'`,[body.sourceId]);
    const url=new URL(body.profileUrl);
    if(!sources[0]||url.origin!==new URL(sources[0].base_url).origin||url.username||url.password)throw new BadRequestException('Choose an approved official faculty source matching the profile domain');
    const key='contact-'+createHash('sha256').update(id+url.href+new Date().toISOString().slice(0,10)).digest('hex');
    const jobs=await this.db.query(`INSERT INTO crawl_job(source_id,idempotency_key,status,depth,mode,progress) VALUES($1,$2,'queued','shallow','refresh',$3) ON CONFLICT(source_id,idempotency_key) DO UPDATE SET status=CASE WHEN crawl_job.status IN ('failed','cancelled') THEN 'queued' ELSE crawl_job.status END RETURNING id,status`,[body.sourceId,key,JSON.stringify({contactTargets:[{facultyId:id,profileUrl:url.href}]})]);
    await this.db.query(`INSERT INTO audit_event(actor_id,action,entity_type,entity_id,metadata) VALUES($1,'faculty_contact_collection_queued','faculty_member',$2,$3)`,[req.staff.id,id,JSON.stringify({jobId:jobs[0].id,sourceId:body.sourceId})]);
    return {data:jobs[0]};
  }

  @Delete('admin/catalog/:kind/:id')
  @UseGuards(StaffGuard)
  deleteItem(@Param('kind') kind: string, @Param('id') id: string, @Req() req: StaffRequest) {
    if (!['institutions', 'programmes', 'funding', 'faculty'].includes(kind)) {
      throw new BadRequestException('Invalid catalog kind');
    }
    return this.catalog.deleteItem(kind as any, id, req.staff.id);
  }

  @Patch('admin/catalog/programmes/:id')
  @UseGuards(StaffGuard)
  updateProgramme(
    @Param('id') id: string,
    @Body() body: { official_url?: string },
    @Req() req: StaffRequest,
  ) {
    return this.catalog.updateProgramme(id, body, req.staff.id);
  }
}
