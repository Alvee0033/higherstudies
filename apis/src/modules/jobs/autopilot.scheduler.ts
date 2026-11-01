import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';
import { DEFAULT_AUTOPILOT, type AutopilotConfig } from './jobs.service.js';

type SourceRow = { id: string; name: string; updated_at: Date };

@Injectable()
export class AutopilotScheduler implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AutopilotScheduler.name);
  private timer: NodeJS.Timeout | undefined;

  constructor(private readonly db: DatabaseService) {}

  onModuleInit() {
    this.timer = setInterval(() => void this.tick(), 30_000);
    this.timer.unref();
    void this.tick();
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  private async tick() {
    try {
      await this.db.transaction(async (client) => {
        const lock = await client.query<{ locked: boolean }>(
          `SELECT pg_try_advisory_xact_lock(81027, 1) AS locked`,
        );
        if (!lock.rows[0]?.locked) return;

        const settings = await client.query<{
          value: AutopilotConfig;
          updated_at: Date;
        }>(
          `SELECT value,updated_at FROM system_setting WHERE key='autopilot' FOR UPDATE`,
        );
        const row = settings.rows[0];
        const config = row?.value ?? DEFAULT_AUTOPILOT;
        if (!config.enabled) return;

        const now = new Date();
        const scheduleDue =
          config.triggerOnSchedule &&
          (!config.nextRunAt || new Date(config.nextRunAt) <= now);
        const checkedSince =
          config.lastCheckedAt ??
          row?.updated_at?.toISOString() ??
          now.toISOString();
        let changedSources: SourceRow[] = [];
        if (config.triggerOnSourceEnabled) {
          changedSources = (
            await client.query<SourceRow>(
              `SELECT s.id,s.name,s.updated_at FROM source s
             WHERE s.enabled=true AND s.permission_status='approved' AND s.adapter IN ('studyportals-search','openalex-authors')
               AND (cardinality($2::uuid[]) = 0 OR s.id=ANY($2::uuid[]))
               AND EXISTS (
                 SELECT 1 FROM audit_event ae
                 WHERE ae.entity_type='source' AND ae.entity_id=s.id AND ae.action='update'
                   AND ae.created_at > $1
                   AND (ae.metadata->>'enabled'='true' OR ae.metadata->>'permissionStatus'='approved')
               )
             ORDER BY s.updated_at ASC LIMIT $3`,
              [checkedSince, config.sourceIds ?? [], config.maxSourcesPerRun],
            )
          ).rows;
        }
        if (!scheduleDue && !changedSources.length) return;

        let sources: SourceRow[];
        if (scheduleDue) {
          sources = (
            await client.query<SourceRow>(
              `SELECT id,name,updated_at FROM source
             WHERE enabled=true AND permission_status='approved' AND adapter IN ('studyportals-search','openalex-authors')
               AND (cardinality($1::uuid[]) = 0 OR id=ANY($1::uuid[]))
               AND ($2::boolean=false OR last_success_at IS NULL OR last_success_at <= now() - make_interval(hours => refresh_hours))
             ORDER BY last_success_at ASC NULLS FIRST, created_at ASC LIMIT $3`,
              [
                config.sourceIds ?? [],
                config.onlyDueSources,
                config.maxSourcesPerRun,
              ],
            )
          ).rows;
        } else {
          sources = changedSources;
        }

        let queued = 0;
        const slot = scheduleDue ? now.toISOString() : null;
        for (const source of sources) {
          const key = slot
            ? `autopilot:scheduled:${slot}`
            : `autopilot:source:${source.id}:${new Date(source.updated_at).toISOString()}`;
          const result = await client.query(
            `INSERT INTO crawl_job(source_id,idempotency_key,status,depth,mode)
             VALUES($1,$2,'queued',$3,$4) ON CONFLICT(source_id,idempotency_key) DO NOTHING RETURNING id`,
            [source.id, key, config.depth, config.mode],
          );
          queued += result.rowCount ?? 0;
        }

        const next: AutopilotConfig = {
          ...config,
          lastCheckedAt: now.toISOString(),
          lastRunAt: scheduleDue ? now.toISOString() : config.lastRunAt,
          nextRunAt: scheduleDue
            ? new Date(
                now.getTime() + config.intervalHours * 3_600_000,
              ).toISOString()
            : config.nextRunAt,
          lastRunSummary: `Queued ${queued} job${queued === 1 ? '' : 's'}; jobs require a collector worker to execute.`,
        };
        await client.query(
          `UPDATE system_setting SET value=$1,updated_at=now() WHERE key='autopilot'`,
          [JSON.stringify(next)],
        );
        await client.query(
          `INSERT INTO audit_event(action,entity_type,metadata) VALUES('autopilot_enqueue','crawl_job',$1)`,
          [
            JSON.stringify({
              queued,
              scheduleDue,
              sourceIds: sources.map((source) => source.id),
            }),
          ],
        );
        if (queued)
          this.logger.log(`Autopilot queued ${queued} collection job(s).`);
      });
    } catch (error) {
      this.logger.error(
        'Autopilot scheduler tick failed',
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
