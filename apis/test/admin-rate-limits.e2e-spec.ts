import {Test} from '@nestjs/testing';
import {APP_GUARD} from '@nestjs/core';
import {UnauthorizedException} from '@nestjs/common';
import {ThrottlerGuard,ThrottlerModule} from '@nestjs/throttler';
import {FastifyAdapter,type NestFastifyApplication} from '@nestjs/platform-fastify';
import {CatalogController} from '../src/modules/catalog/catalog.controller.js';
import {CatalogService} from '../src/modules/catalog/catalog.service.js';
import {AuthController} from '../src/modules/auth/auth.controller.js';
import {AuthService} from '../src/modules/auth/auth.service.js';
import {StaffGuard} from '../src/modules/auth/staff.guard.js';

describe('Admin catalogue rate limits',()=>{
 let app:NestFastifyApplication;
 beforeEach(async()=>{
  const module=await Test.createTestingModule({
   imports:[ThrottlerModule.forRoot([{ttl:60000,limit:120}])],
   controllers:[CatalogController,AuthController],
   providers:[{provide:APP_GUARD,useClass:ThrottlerGuard},{provide:CatalogService,useValue:{list:vi.fn().mockResolvedValue({data:[],page:{total:15025,nextCursor:null}})}},{provide:AuthService,useValue:{login:vi.fn().mockRejectedValue(new UnauthorizedException())}}],
  }).overrideGuard(StaffGuard).useValue({canActivate:()=>true}).compile();
  app=module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
  await app.init();await app.getHttpAdapter().getInstance().ready();
 });
 afterEach(async()=>{await app.close();});
 it('supports staff page reads beyond the old limit while retaining public throttling',async()=>{
  for(let index=0;index<125;index++) expect((await app.inject({method:'GET',url:`/v1/admin/catalog/faculty?limit=25&offset=${index*25}`})).statusCode).toBe(200);
  for(let index=0;index<120;index++) expect((await app.inject({method:'GET',url:'/v1/faculty?limit=25'})).statusCode).toBe(200);
  const limited=await app.inject({method:'GET',url:'/v1/faculty?limit=25'});
  expect(limited.statusCode).toBe(429);expect(limited.headers['retry-after']).toBeDefined();
 });
 it('retains the five-attempt staff login limit',async()=>{
  for(let index=0;index<5;index++) expect((await app.inject({method:'POST',url:'/v1/admin/auth/login',payload:{email:'invalid@example.test',password:'invalid'}})).statusCode).toBe(401);
  expect((await app.inject({method:'POST',url:'/v1/admin/auth/login',payload:{email:'invalid@example.test',password:'invalid'}})).statusCode).toBe(429);
 });
});
