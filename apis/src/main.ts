import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyHelmet from '@fastify/helmet';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ bodyLimit: 1_048_576, trustProxy: false }));
  await app.register(fastifyCookie);
  await app.register(fastifyHelmet);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  const origins = (process.env.CORS_ORIGINS ?? 'http://localhost:3000,http://localhost:3001,http://localhost:3002,http://127.0.0.1:3000,http://127.0.0.1:3001,http://127.0.0.1:3002').split(',').map((value) => value.trim());
  app.enableCors({ origin: origins, credentials: true, methods: ['GET','HEAD','POST','PUT','PATCH','DELETE','OPTIONS'], allowedHeaders: ['Content-Type','X-CSRF-Token','x-admin-app','Authorization'] });
  const port = process.env.PORT ?? 4000;
  await app.listen({ port: Number(port), host: process.env.HOST ?? '127.0.0.1' });
  console.log(`Backend server is running on http://localhost:${port}`);
}
await bootstrap();
