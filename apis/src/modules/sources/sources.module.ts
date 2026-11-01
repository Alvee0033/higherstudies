import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { SourcesController } from './sources.controller.js';

@Module({ imports: [AuthModule], controllers: [SourcesController] })
export class SourcesModule {}
