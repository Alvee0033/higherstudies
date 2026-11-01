import { ForbiddenException } from '@nestjs/common';
import { ReviewService } from './review.service.js';

describe('ReviewService publication gate', () => {
  it('does not publish from a source without approved access', async () => {
    const client = {
      query: vi.fn()
        .mockResolvedValueOnce({ rows: [{ id: 'item-1', source_id: 'source-1', record_type: 'programme', source_url: 'https://uni.edu/program', payload: { title: 'MSc', institutionId: 'inst-1', degree: 'masters' }, review_state: 'needs_review', version: 1 }] })
        .mockResolvedValueOnce({ rows: [{ permission_status: 'pending', adapter: 'official_university', base_url: 'https://uni.edu', enabled: true }] }),
    };
    const db = { transaction: (work: (tx: typeof client) => unknown) => work(client) };
    const service = new ReviewService(db as never);

    await expect(service.decide('item-1', 'staff-1', 'approve', 1))
      .rejects.toBeInstanceOf(ForbiddenException);
    expect(client.query).toHaveBeenCalledTimes(2);
  });

  it('does not accept admission claims from Studyportals as verified facts', async () => {
    const client = {
      query: vi.fn()
        .mockResolvedValueOnce({ rows: [{ id: 'item-1', source_id: 'source-1', record_type: 'requirement_claim', source_url: 'https://mastersportal.com/program', payload: { title: 'MSc', institutionId: 'inst-1', degree: 'masters' }, review_state: 'needs_review', version: 1 }] })
        .mockResolvedValueOnce({ rows: [{ permission_status: 'approved', adapter: 'studyportals', base_url: 'https://mastersportal.com', enabled: true }] }),
    };
    const db = { transaction: (work: (tx: typeof client) => unknown) => work(client) };
    const service = new ReviewService(db as never);

    await expect(service.decide('item-1', 'staff-1', 'approve', 1))
      .rejects.toBeInstanceOf(ForbiddenException);
    expect(client.query).toHaveBeenCalledTimes(2);
  });
});

describe('Review selection across all pages',()=>{
 it('returns a bounded selection manifest beyond the visible page and preserves its cutoff',async()=>{
  const rows=Array.from({length:1001},(_,index)=>({id:`id-${index}`,version:1,label:`Record ${index}`}));
  const db={query:vi.fn().mockResolvedValue(rows)};
  const result=await new ReviewService(db as never).selection('institution','university',undefined,'2026-10-19T00:00:00.000Z',1000);
  expect(result.data).toHaveLength(1000);
  expect(result.page.nextCursor).toBe('id-999');
  expect(result.page.selectedBefore).toBe('2026-10-19T00:00:00.000Z');
  expect(db.query.mock.calls[0][1]).toEqual(['institution','2026-10-19T00:00:00.000Z',null,'university',1001]);
 });
});
