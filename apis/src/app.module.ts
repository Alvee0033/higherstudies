import { ExecutionContext, Injectable, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { CatalogModule } from './modules/catalog/catalog.module.js';
import { IngestionModule } from './modules/ingestion/ingestion.module.js';
import { ReviewModule } from './modules/review/review.module.js';
import { SourcesModule } from './modules/sources/sources.module.js';
import { JobsModule } from './modules/jobs/jobs.module.js';
import { SettingsModule } from './modules/settings/settings.module.js';
import { StudentEmailTrackerModule } from './modules/student-email-tracker/student-email-tracker.module.js';
import { StudentWorkspaceModule } from './modules/student-workspace/student-workspace.module.js';

@Injectable()
export class AdminBypassThrottlerGuard extends ThrottlerGuard {
  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const url = req.raw?.url || req.url || '';
    const origin = req.headers?.origin || '';
    const referer = req.headers?.referer || '';
    const isAdminHeader = req.headers?.['x-admin-app'] === 'true' || req.raw?.headers?.['x-admin-app'] === 'true';
    const isStaffCookie = Boolean(req.cookies?.hs_admin_session);
    const isStaffOrigin = origin.includes(':3001') || referer.includes(':3001');
    const isStudentOrigin = origin.includes(':3002') || referer.includes(':3002');

    if (url.startsWith('/v1/admin') || isStaffCookie || isAdminHeader || isStaffOrigin || isStudentOrigin) {
      return true;
    }
    return super.shouldSkip(context);
  }
}

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ThrottlerModule.forRoot([{ ttl: 60_000, limit: 1000 }]), DatabaseModule, AuthModule, CatalogModule, IngestionModule, ReviewModule, SourcesModule, JobsModule, SettingsModule, StudentEmailTrackerModule, StudentWorkspaceModule],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: AdminBypassThrottlerGuard }],
})
export class AppModule {}
