import { describe, expect, it, vi } from 'vitest';
import { StudentAuthService } from './student-auth.service.js';

describe('StudentAuthService', () => {
  it('creates a session for a newly registered student without storing a plain password', async () => {
    const query = vi.fn()
      .mockResolvedValueOnce([{ id: 'student-id', email: 'person@example.com', display_name: 'Student' }])
      .mockResolvedValueOnce([]);
    const service = new StudentAuthService({ query } as never);

    const result = await service.register(' Person@Example.com ', 'a-very-long-password', 'Student');

    expect(result.user.email).toBe('person@example.com');
    expect(result.token).toBeTruthy();
    expect(query.mock.calls[0][0]).toContain('INSERT INTO student_user');
    expect(query.mock.calls[0][1][1]).not.toBe('a-very-long-password');
    expect(query.mock.calls[1][0]).toContain('INSERT INTO student_session');
  });
});
