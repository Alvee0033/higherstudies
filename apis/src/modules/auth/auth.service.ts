import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomBytes, createHash, timingSafeEqual } from 'node:crypto';
import argon2 from 'argon2';
import { DatabaseService } from '../../database/database.service.js';

export interface StaffIdentity { id: string; email: string; role: 'editor' | 'admin' }
interface StaffRow extends StaffIdentity { password_hash: string; disabled_at: Date | null }
interface SessionRow extends StaffIdentity { csrf_hash: string }

const hash = (value: string) => createHash('sha256').update(value).digest('hex');

@Injectable()
export class AuthService {
  constructor(private readonly db: DatabaseService) {}

  async login(email: string, password: string) {
    const rows = await this.db.query<StaffRow>('SELECT id,email,role,password_hash,disabled_at FROM staff_user WHERE email=lower($1)', [email]);
    const user = rows[0];
    if (!user || user.disabled_at || !(await argon2.verify(user.password_hash, password))) throw new UnauthorizedException('Invalid credentials');
    const token = randomBytes(32).toString('base64url');
    const csrf = randomBytes(32).toString('base64url');
    await this.db.query('INSERT INTO staff_session(user_id,token_hash,csrf_hash,expires_at) VALUES($1,$2,$3,now()+interval \'12 hours\')', [user.id, hash(token), hash(csrf)]);
    return { token, csrf, user: { id: user.id, email: user.email, role: user.role } };
  }

  async authenticate(token?: string): Promise<{ user: StaffIdentity; csrfHash: string }> {
    if (!token) throw new UnauthorizedException();
    const rows = await this.db.query<SessionRow>(`SELECT u.id,u.email,u.role,s.csrf_hash FROM staff_session s
      JOIN staff_user u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.revoked_at IS NULL
      AND s.expires_at>now() AND u.disabled_at IS NULL`, [hash(token)]);
    const session = rows[0];
    if (!session) throw new UnauthorizedException();
    return { user: { id: session.id, email: session.email, role: session.role }, csrfHash: session.csrf_hash };
  }

  verifyCsrf(expectedHash: string, token?: string) {
    if (!token) throw new UnauthorizedException('CSRF token required');
    const actual = Buffer.from(hash(token));
    const expected = Buffer.from(expectedHash);
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) throw new UnauthorizedException('Invalid CSRF token');
  }

  async logout(token?: string) {
    if (token) await this.db.query('UPDATE staff_session SET revoked_at=now() WHERE token_hash=$1', [hash(token)]);
  }
}
