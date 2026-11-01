import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { fork } from 'node:child_process';
import path from 'node:path';
import { DatabaseService } from '../../database/database.service.js';

type RunOptions = {
  requestIntervalSeconds?: number; restEveryRecords?: number; restSeconds?: number;
  target?: 'all' | 'programmes' | 'faculty';
  sourceIds?: string[];
  depth: 'shallow' | 'medium' | 'deep';
  mode: 'discovery' | 'refresh' | 'full';
};

export type AutopilotConfig = {
  enabled: boolean;
  intervalHours: number;
  triggerOnSchedule: boolean;
  triggerOnSourceEnabled: boolean;
  onlyDueSources: boolean;
  sourceIds: string[];
  maxSourcesPerRun: number;
  depth: RunOptions['depth'];
  mode: RunOptions['mode'];
  nextRunAt: string | null;
  lastRunAt: string | null;
  lastCheckedAt: string | null;
  lastRunSummary: string | null;
};

export const DEFAULT_AUTOPILOT: AutopilotConfig = {
  enabled: false,
  intervalHours: 24,
  triggerOnSchedule: true,
  triggerOnSourceEnabled: false,
  onlyDueSources: true,
  sourceIds: [],
  maxSourcesPerRun: 10,
  depth: 'shallow',
  mode: 'discovery',
  nextRunAt: null,
  lastRunAt: null,
  lastCheckedAt: null,
  lastRunSummary: null,
};

@Injectable()
export class JobsService {
  constructor(private readonly db: DatabaseService) {}

  async list() {
    return {
      data: await this.db.query(
        `SELECT j.id,j.source_id,j.progress,j.runtime,j.status,j.depth,j.mode,j.found_count,j.accepted_count,j.error_count,j.last_error,j.started_at,j.completed_at,j.created_at,s.name AS source_name,s.adapter FROM crawl_job j JOIN source s ON s.id=j.source_id ORDER BY j.created_at DESC LIMIT 100`,
      ),
    };
  }

  async preview(id: string) {
    return { data: await this.db.query(`SELECT id,record_type,source_url,payload,review_state,created_at FROM staged_record WHERE job_id=$1 ORDER BY created_at DESC LIMIT 20`, [id]) };
  }

  async getAutopilot() {
    const rows = await this.db.query<{ value: AutopilotConfig }>(
      `SELECT value FROM system_setting WHERE key='autopilot'`,
    );
    const workerRows = await this.db.query<{ value: { available?: boolean; lastHeartbeatAt?: string; message?: string } }>(
      `SELECT value FROM system_setting WHERE key='collector_worker'`,
    );
    const heartbeat = workerRows[0]?.value;
    const heartbeatAt = heartbeat?.lastHeartbeatAt ? Date.parse(heartbeat.lastHeartbeatAt) : 0;
    const available = Boolean(heartbeat?.available && Number.isFinite(heartbeatAt) && Date.now() - heartbeatAt < 30_000);
    return {
      config: rows[0]?.value ?? DEFAULT_AUTOPILOT,
      collectorWorker: {
        available,
        message: available ? heartbeat?.message ?? 'Collector worker online.' : 'Collector worker is offline or its heartbeat is stale.',
      },
    };
  }

  async ensureWorker(): Promise<{ available: boolean; message: string }> {
    const status = await this.getAutopilot();
    if (status.collectorWorker.available) {
      return status.collectorWorker;
    }
    try {
      const scriptPath = path.resolve(process.cwd(), 'scripts/collector-worker.mjs');
      const child = fork(scriptPath, [], {
        detached: true,
        stdio: 'ignore',
        env: { ...process.env },
      });
      child.unref();
      return { available: true, message: 'Collector worker started successfully.' };
    } catch (err) {
      return {
        available: false,
        message: 'Could not spawn worker: ' + (err instanceof Error ? err.message : String(err)),
      };
    }
  }

  async updateAutopilot(
    config: Omit<
      AutopilotConfig,
      'nextRunAt' | 'lastRunAt' | 'lastCheckedAt' | 'lastRunSummary'
    >,
    staffId: string,
  ) {
    if (!config.triggerOnSchedule && !config.triggerOnSourceEnabled) {
      throw new BadRequestException('Enable at least one autopilot trigger');
    }
    if (config.sourceIds.length) {
      const available = await this.db.query<{ id: string }>(
        `SELECT id FROM source WHERE id=ANY($1::uuid[]) AND enabled=true AND permission_status='approved'`,
        [config.sourceIds],
      );
      if (available.length !== config.sourceIds.length) {
        throw new BadRequestException(
          'Selected sources must be approved and enabled',
        );
      }
    }

    return this.db.transaction(async (client) => {
      const existing = await client.query<{ value: AutopilotConfig }>(
        `SELECT value FROM system_setting WHERE key='autopilot' FOR UPDATE`,
      );
      const previous = existing.rows[0]?.value ?? DEFAULT_AUTOPILOT;
      const next: AutopilotConfig = {
        ...config,
        nextRunAt: config.enabled
          ? new Date(
              Date.now() + config.intervalHours * 3_600_000,
            ).toISOString()
          : null,
        lastRunAt: previous.lastRunAt ?? null,
        lastCheckedAt: new Date().toISOString(),
        lastRunSummary: previous.lastRunSummary ?? null,
      };
      await client.query(
        `INSERT INTO system_setting(key,value,updated_at) VALUES('autopilot',$1,now())
         ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value,updated_at=now()`,
        [JSON.stringify(next)],
      );
      await client.query(
        `INSERT INTO audit_event(actor_id,action,entity_type,metadata) VALUES($1,'update_autopilot','system_setting',$2)`,
        [
          staffId,
          JSON.stringify({
            enabled: next.enabled,
            intervalHours: next.intervalHours,
            sourceIds: next.sourceIds,
          }),
        ],
      );
      return { config: next };
    });
  }

  async queue(options: RunOptions, staffId: string) {
    await this.ensureWorker();
    const requested = options.sourceIds?.length ?? 0;
    if (requested > 20)
      throw new BadRequestException('At most 20 sources can be queued at once');
    return this.db.transaction(async (client) => {
      const params: unknown[] = [];
      const filter = requested
        ? (() => {
            params.push(options.sourceIds);
            return 'AND id = ANY($1::uuid[])';
          })()
        : '';
      const targetFilter = options.target === 'programmes' ? "AND adapter='studyportals-search'" : options.target === 'faculty' ? "AND adapter='openalex-authors'" : '';
      const sources = await client.query<{ id: string; name: string }>(
        `SELECT id,name FROM source WHERE enabled=true AND permission_status='approved' AND adapter IN ('studyportals-search','openalex-authors') ${filter} ${targetFilter} ORDER BY created_at ASC LIMIT 20`,
        params,
      );
      if (!sources.rowCount)
        throw new BadRequestException(
          'No approved, enabled source is available for collection',
        );
      if (requested && sources.rowCount !== requested)
        throw new BadRequestException(
          'Every selected source must be approved and enabled',
        );
      const jobs = [];
      for (const source of sources.rows) {
        await client.query(`INSERT INTO source_collection_state(source_id,request_interval_seconds,rest_every_records,rest_seconds) VALUES($1,$2,$3,$4) ON CONFLICT(source_id) DO UPDATE SET request_interval_seconds=EXCLUDED.request_interval_seconds,rest_every_records=EXCLUDED.rest_every_records,rest_seconds=EXCLUDED.rest_seconds`,[source.id,options.requestIntervalSeconds ?? 10,options.restEveryRecords ?? 300,options.restSeconds ?? 300]);
        await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [source.id]);
        const active = await client.query<{id:string;status:string;created_at:Date}>(`SELECT id,status,created_at FROM crawl_job WHERE source_id=$1 AND status IN ('queued','running') ORDER BY created_at LIMIT 1`, [source.id]);
        if (active.rows[0]) {
          jobs.push({ ...active.rows[0], sourceId: source.id, sourceName: source.name });
          continue;
        }
        const rows = await client.query<{
          id: string;
          status: string;
          created_at: Date;
        }>(
          `INSERT INTO crawl_job(source_id,idempotency_key,status,depth,mode,progress) VALUES($1,$2,'queued',$3,$4,'{}'::jsonb) RETURNING id,status,created_at`,
          [source.id, `manual:${randomUUID()}`, options.depth, options.mode],
        );
        jobs.push({
          ...rows.rows[0],
          sourceId: source.id,
          sourceName: source.name,
        });
      }
      await client.query(
        `INSERT INTO audit_event(actor_id,action,entity_type,metadata) VALUES($1,'queue','crawl_job',$2)`,
        [
          staffId,
          JSON.stringify({
            depth: options.depth,
            mode: options.mode,
            jobIds: jobs.map((job) => job.id),
          }),
        ],
      );
      return { data: jobs };
    });
  }

  async cancel(id: string, staffId: string) {
    const rows = await this.db.query<{ id: string; status: string }>(
      `UPDATE crawl_job SET status='cancelled',completed_at=now() WHERE id=$1 AND status IN ('queued','running') RETURNING id,status`,
      [id],
    );
    if (!rows[0])
      throw new NotFoundException('Queued or running job not found');
    await this.db.query(
      `INSERT INTO audit_event(actor_id,action,entity_type,entity_id) VALUES($1,'cancel','crawl_job',$2)`,
      [staffId, id],
    );
    return { data: rows[0] };
  }
}
