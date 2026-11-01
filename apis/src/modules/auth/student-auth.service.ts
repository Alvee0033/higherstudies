import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import argon2 from 'argon2';
import { DatabaseService } from '../../database/database.service.js';

export interface StudentIdentity { id: string; email: string; displayName: string }
type StudentRow = StudentIdentity & { password_hash: string };
type SessionRow = StudentIdentity & { csrf_hash: string };
const hash = (value: string) => createHash('sha256').update(value).digest('hex');

@Injectable()
export class StudentAuthService {
  constructor(private readonly db: DatabaseService) {}

  private async createSession(user: StudentIdentity) {
    const token = randomBytes(32).toString('base64url');
    const csrf = randomBytes(32).toString('base64url');
    await this.db.query(`INSERT INTO student_session(user_id,token_hash,csrf_hash,expires_at)
      VALUES($1,$2,$3,now()+interval '30 days')`, [user.id, hash(token), hash(csrf)]);
    return { token, csrf, user };
  }

  async register(email: string, password: string, displayName: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const cleanName = displayName.trim();
    const passwordHash = await argon2.hash(password);
    try {
      const rows = await this.db.query<StudentIdentity>(`INSERT INTO student_user(email,display_name,password_hash)
        VALUES($1,$2,$3) RETURNING id,email,display_name AS "displayName"`, [normalizedEmail, cleanName, passwordHash]);
      if (!rows[0]) throw new Error('Student account was not created');
      return this.createSession(rows[0]);
    } catch (error) {
      if ((error as { code?: string }).code === '23505') throw new ConflictException('An account with this email already exists');
      throw error;
    }
  }

  async login(email: string, password: string) {
    const rows = await this.db.query<StudentRow>(`SELECT id,email,display_name AS "displayName",password_hash
      FROM student_user WHERE email=lower($1)`, [email.trim()]);
    const row = rows[0];
    if (!row || !(await argon2.verify(row.password_hash, password))) throw new UnauthorizedException('Invalid email or password');
    return this.createSession({ id: row.id, email: row.email, displayName: row.displayName });
  }

  async authenticate(token?: string) {
    if (!token) throw new UnauthorizedException();
    const rows = await this.db.query<SessionRow>(`SELECT u.id,u.email,u.display_name AS "displayName",s.csrf_hash
      FROM student_session s JOIN student_user u ON u.id=s.user_id
      WHERE s.token_hash=$1 AND s.revoked_at IS NULL AND s.expires_at>now()`, [hash(token)]);
    const row = rows[0];
    if (!row) throw new UnauthorizedException();
    return { user: { id: row.id, email: row.email, displayName: row.displayName }, csrfHash: row.csrf_hash };
  }

  verifyCsrf(expectedHash: string, token?: string) {
    if (!token) throw new UnauthorizedException('CSRF token required');
    const actual = Buffer.from(hash(token));
    const expected = Buffer.from(expectedHash);
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) throw new UnauthorizedException('Invalid CSRF token');
  }

  async changePassword(userId:string,currentPassword:string,newPassword:string){
    const passwordHash=await argon2.hash(newPassword);
    await this.db.transaction(async client=>{
      const rows=await client.query<{password_hash:string}>('SELECT password_hash FROM student_user WHERE id=$1 FOR UPDATE',[userId]);
      if(!rows.rows[0]||!await argon2.verify(rows.rows[0].password_hash,currentPassword))throw new UnauthorizedException('Current password is incorrect');
      await client.query('UPDATE student_user SET password_hash=$2 WHERE id=$1',[userId,passwordHash]);
      await client.query('UPDATE student_session SET revoked_at=now() WHERE user_id=$1 AND revoked_at IS NULL',[userId]);
    });
  }

  async logout(token?: string) {
    if (token) await this.db.query('UPDATE student_session SET revoked_at=now() WHERE token_hash=$1', [hash(token)]);
  }
}
