import { describe, expect, it, vi } from 'vitest';
import { SettingsService } from './settings.service.js';

describe('SettingsService audit events', () => {
  it('returns a bounded newest-first audit page with staff identity', async () => {
    const events = [{ id: 'event-1', action: 'review', actor_email: 'editor@example.edu' }];
    const db = { query: vi.fn().mockResolvedValue(events) };
    const service = new SettingsService(db as never);

    await expect(service.listAuditEvents({ limit: 25, offset: 50 })).resolves.toEqual(events);
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('ORDER BY ae.created_at DESC'), [25, 50]);
  });

  it('rejects unbounded audit pagination', async () => {
    const service = new SettingsService({ query: vi.fn() } as never);
    await expect(service.listAuditEvents({ limit: 101, offset: 0 })).rejects.toThrow();
  });
});
