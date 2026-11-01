import { Test } from '@nestjs/testing';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from '../src/app.module.js';

describe('Fastify API (e2e)', () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    process.env.DATABASE_URL = 'postgres://unused:unused@127.0.0.1/unused';
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('serves the starter route through Fastify', async () => {
    const response = await app.inject({ method: 'GET', url: '/' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe('Hello World!');
  });

  afterEach(async () => { await app.close(); });
});
