import { CatalogService } from './catalog.service.js';
import { BadRequestException } from '@nestjs/common';

describe('Bounded staff faculty pagination', () => {
  it('returns the full matching count while reading only one requested page', async () => {
    const db = {
      query: vi
        .fn()
        .mockResolvedValueOnce([{ total: '15025' }])
        .mockResolvedValueOnce([{ id: 'row' }]),
    };
    const result = await new CatalogService(db as never).list(
      'faculty',
      { limit: '25', offset: '10000', sort: 'newest', country: 'US' },
      true,
    );
    expect(result.page.total).toBe(15025);
    expect(result.data).toEqual([{ id: 'row' }]);
    expect(db.query.mock.calls[1][0]).toContain('LIMIT $2 OFFSET 10000');
    expect(db.query.mock.calls[1][1]).toEqual([['US'], 26]);
  });
  it('supports bounded public pagination with source permission gate', async () => {
    const db={query:vi.fn().mockResolvedValueOnce([{total:'220'}]).mockResolvedValueOnce([{id:'row'}])};
    const result=await new CatalogService(db as never).list('faculty',{offset:'100',limit:'20'});
    expect(result.page.total).toBe(220);
    expect(db.query.mock.calls[1][0]).toContain('src.permission_status');
    expect(db.query.mock.calls[1][0]).toContain('LIMIT $1 OFFSET 100');
    expect(db.query.mock.calls[1][1]).toEqual([21]);
    await expect(new CatalogService({} as never).list('faculty',{offset:'10000001'})).rejects.toBeInstanceOf(BadRequestException);
  });
  it('rejects invalid offset and sort inputs', async () => {
    const service = new CatalogService({ query: vi.fn() } as never);
    await expect(
      service.list('faculty', { offset: '-1' }, true),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      service.list(
        'faculty',
        { sort: 'name;DROP TABLE faculty_member' },
        true,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});

describe('updateProgramme', () => {
  const validUuid = '123e4567-e89b-12d3-a456-426614174000';
  it('rejects invalid uuid', async () => {
    const service = new CatalogService({} as never);
    await expect(
      service.updateProgramme('not-a-uuid', {}, 'staff-id'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects non-https or portal domain official URLs', async () => {
    const service = new CatalogService({} as never);
    await expect(
      service.updateProgramme(
        validUuid,
        { official_url: 'http://insecure.edu' },
        'staff-id',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      service.updateProgramme(
        validUuid,
        { official_url: 'https://www.mastersportal.com/studies/1' },
        'staff-id',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('updates valid official URL with transaction and audit event', async () => {
    const client = {
      query: vi
        .fn()
        .mockResolvedValueOnce({
          rows: [{ id: validUuid, title: 'CS', official_url: null }],
        })
        .mockResolvedValueOnce({
          rows: [
            { id: validUuid, official_url: 'https://university.edu/cs' },
          ],
        })
        .mockResolvedValueOnce({ rows: [] }),
    };
    const db = {
      transaction: vi
        .fn()
        .mockImplementation((fn: (c: typeof client) => unknown) => fn(client)),
    };
    const service = new CatalogService(db as never);
    const result = await service.updateProgramme(
      validUuid,
      { official_url: 'https://university.edu/cs' },
      'staff-123',
    );
    expect(result.data.official_url).toBe('https://university.edu/cs');
    expect(client.query).toHaveBeenCalledTimes(3);
    expect(client.query.mock.calls[1][1]).toEqual([
      'https://university.edu/cs',
      validUuid,
    ]);
    expect(client.query.mock.calls[2][0]).toContain('INSERT INTO audit_event');
  });
});
