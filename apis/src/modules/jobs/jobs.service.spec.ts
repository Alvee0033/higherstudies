import { BadRequestException } from '@nestjs/common';
import { JobsService, DEFAULT_AUTOPILOT } from './jobs.service.js';

describe('JobsService autopilot configuration', () => {
  const service = new JobsService({} as never);

  it('keeps autopilot disabled by default', () => {
    expect(DEFAULT_AUTOPILOT.enabled).toBe(false);
    expect(DEFAULT_AUTOPILOT.nextRunAt).toBeNull();
  });

  it('rejects configurations without any trigger', async () => {
    await expect(
      service.updateAutopilot(
        {
          enabled: true,
          intervalHours: 24,
          triggerOnSchedule: false,
          triggerOnSourceEnabled: false,
          onlyDueSources: true,
          sourceIds: [],
          maxSourcesPerRun: 10,
          depth: 'shallow',
          mode: 'discovery',
        },
        'staff-id',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('starts a new manual job at page one instead of copying a failed checkpoint', async () => {
    const statements: string[] = [];
    const client = {
      query: async (sql: string) => {
        statements.push(sql);
        if (sql.includes('SELECT id,name FROM source'))
          return { rows: [{ id: 'source-id', name: 'OpenAlex' }], rowCount: 1 };
        if (sql.includes("status IN ('queued','running')"))
          return { rows: [], rowCount: 0 };
        if (sql.includes('INSERT INTO crawl_job'))
          return { rows: [{ id: 'new-job', status: 'queued', created_at: new Date() }], rowCount: 1 };
        return { rows: [], rowCount: 1 };
      },
    };
    const db = { transaction: async (callback: (client: typeof client) => Promise<unknown>) => callback(client) };
    const jobs = new JobsService(db as never);
    vi.spyOn(jobs, 'ensureWorker').mockResolvedValue({ available: true, message: 'online' });
    await jobs.queue({ target: 'faculty', depth: 'deep', mode: 'full' }, 'staff-id');
    expect(statements.find((sql) => sql.includes('INSERT INTO crawl_job'))).toContain("'{}'::jsonb");
  });
});
