import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import argon2 from 'argon2';
import { DatabaseService } from '../../database/database.service.js';

export interface CountryItem {
  code: string;
  name: string;
  region: string;
}

export interface RegionDefinition {
  label: string;
  countries: string[];
}

export interface StaffMember {
  id: string;
  email: string;
  role: 'admin' | 'editor';
  created_at: string;
  disabled_at: string | null;
}

@Injectable()
export class SettingsService {
  constructor(private readonly db: DatabaseService) {}

  async listAuditEvents({ limit = 50, offset = 0 }: { limit?: number; offset?: number } = {}) {
    if (!Number.isInteger(limit) || limit < 1 || limit > 100 || !Number.isInteger(offset) || offset < 0 || offset > 1_000_000) {
      throw new BadRequestException('Audit pagination must use limit 1-100 and a bounded non-negative offset.');
    }
    return this.db.query(
      `SELECT ae.id, ae.action, ae.entity_type, ae.entity_id, ae.metadata, ae.created_at,
              su.email AS actor_email
       FROM audit_event ae
       LEFT JOIN staff_user su ON su.id = ae.actor_id
       ORDER BY ae.created_at DESC, ae.id DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
  }

  async getAllSettings() {
    const rows = await this.db.query<{ key: string; value: any }>(
      'SELECT key, value FROM system_setting'
    );
    const result: Record<string, any> = {};
    for (const r of rows) {
      result[r.key] = r.value;
    }
    return {
      countries: (result.countries as CountryItem[]) || [],
      regions: (result.regions as Record<string, RegionDefinition>) || {},
    };
  }

  async getSetting(key: string) {
    const rows = await this.db.query<{ value: any }>(
      'SELECT value FROM system_setting WHERE key = $1',
      [key]
    );
    if (!rows[0]) throw new NotFoundException(`Setting ${key} not found`);
    return rows[0].value;
  }

  async updateSetting(key: string, value: any, actorId: string) {
    await this.db.query(
      `INSERT INTO system_setting (key, value, updated_at)
       VALUES ($1, $2, now())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
      [key, JSON.stringify(value)]
    );
    await this.db.query(
      `INSERT INTO audit_event(actor_id, action, entity_type, metadata)
       VALUES($1, 'update_setting', 'system_setting', $2)`,
      [actorId, JSON.stringify({ key })]
    );
    return { key, value };
  }

  async addCountry(
    country: { code: string; name: string; region: string },
    actorId: string
  ) {
    const code = country.code.trim().toUpperCase();
    const name = country.name.trim();
    const region = country.region.trim().toLowerCase();

    if (!code || code.length !== 2) {
      throw new BadRequestException('Country code must be 2 characters (e.g. US, JP, BD)');
    }
    if (!name) {
      throw new BadRequestException('Country name cannot be empty');
    }

    const { countries, regions } = await this.getAllSettings();

    // Check if code exists, if so update it, otherwise insert
    const existingIndex = countries.findIndex((c) => c.code === code);
    if (existingIndex >= 0) {
      // Remove from old region list if changed
      const oldRegion = countries[existingIndex].region;
      if (oldRegion && regions[oldRegion]?.countries) {
        regions[oldRegion].countries = regions[oldRegion].countries.filter((c) => c !== code);
      }
      countries[existingIndex] = { code, name, region };
    } else {
      countries.push({ code, name, region });
    }

    // Add to region if valid
    if (regions[region]) {
      if (!regions[region].countries.includes(code)) {
        regions[region].countries.push(code);
      }
    }

    await this.updateSetting('countries', countries, actorId);
    await this.updateSetting('regions', regions, actorId);

    return { code, name, region, countries, regions };
  }

  async removeCountry(code: string, actorId: string) {
    const upperCode = code.trim().toUpperCase();
    const { countries, regions } = await this.getAllSettings();

    const filteredCountries = countries.filter((c) => c.code !== upperCode);
    if (filteredCountries.length === countries.length) {
      throw new NotFoundException(`Country ${upperCode} not found`);
    }

    // Remove from all regions
    for (const regKey of Object.keys(regions)) {
      if (Array.isArray(regions[regKey]?.countries)) {
        regions[regKey].countries = regions[regKey].countries.filter(
          (c) => c !== upperCode
        );
      }
    }

    await this.updateSetting('countries', filteredCountries, actorId);
    await this.updateSetting('regions', regions, actorId);

    return { success: true, removedCode: upperCode, countries: filteredCountries, regions };
  }

  // --- STAFF & TEAM MANAGEMENT ---
  async listStaff(): Promise<StaffMember[]> {
    return this.db.query<StaffMember>(
      `SELECT id, email, role, created_at, disabled_at
       FROM staff_user
       ORDER BY created_at ASC`
    );
  }

  async createStaff(
    dto: { email: string; password: string; role: 'admin' | 'editor' },
    actorId: string
  ): Promise<StaffMember> {
    const email = dto.email.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      throw new BadRequestException('Valid email is required');
    }
    if (!dto.password || dto.password.length < 6) {
      throw new BadRequestException('Password must be at least 8 characters');
    }
    if (!['admin', 'editor'].includes(dto.role)) {
      throw new BadRequestException('Role must be either admin or editor');
    }

    const existing = await this.db.query(
      'SELECT id FROM staff_user WHERE email = $1',
      [email]
    );
    if (existing.length > 0) {
      throw new BadRequestException('A team member with this email already exists');
    }

    const passwordHash = await argon2.hash(dto.password);
    const rows = await this.db.query<StaffMember>(
      `INSERT INTO staff_user (email, role, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, role, created_at, disabled_at`,
      [email, dto.role, passwordHash]
    );

    await this.db.query(
      `INSERT INTO audit_event(actor_id, action, entity_type, entity_id, metadata)
       VALUES($1, 'create_staff', 'staff_user', $2, $3)`,
      [actorId, rows[0].id, JSON.stringify({ email, role: dto.role })]
    );

    return rows[0];
  }

  async updateStaffRole(
    id: string,
    role: 'admin' | 'editor',
    actorId: string
  ) {
    if (!['admin', 'editor'].includes(role)) {
      throw new BadRequestException('Invalid role');
    }
    const rows = await this.db.query<StaffMember>(
      `UPDATE staff_user
       SET role = $2
       WHERE id = $1
       RETURNING id, email, role, created_at, disabled_at`,
      [id, role]
    );
    if (!rows[0]) throw new NotFoundException('Team member not found');

    await this.db.query(
      `INSERT INTO audit_event(actor_id, action, entity_type, entity_id, metadata)
       VALUES($1, 'update_staff_role', 'staff_user', $2, $3)`,
      [actorId, id, JSON.stringify({ role })]
    );

    return rows[0];
  }

  async deleteStaff(id: string, actorId: string) {
    if (id === actorId) {
      throw new BadRequestException('You cannot delete your own account');
    }

    // Check references in reviews/revisions
    const revCheck = await this.db.query<{ count: string }>(
      `SELECT count(*) FROM (
        SELECT actor_id FROM review_decision WHERE actor_id = $1
        UNION ALL
        SELECT actor_id FROM record_revision WHERE actor_id = $1
      ) t`,
      [id]
    );
    const refCount = parseInt(revCheck[0]?.count || '0', 10);

    if (refCount > 0) {
      // User has audit history, disable them instead of hard deleting to preserve integrity
      const disabled = await this.db.query<StaffMember>(
        `UPDATE staff_user
         SET disabled_at = now()
         WHERE id = $1
         RETURNING id, email, role, created_at, disabled_at`,
        [id]
      );
      // Revoke any active sessions
      await this.db.query('DELETE FROM staff_session WHERE user_id = $1', [id]);
      await this.db.query(
        `INSERT INTO audit_event(actor_id, action, entity_type, entity_id, metadata)
         VALUES($1, 'disable_staff', 'staff_user', $2, $3)`,
        [actorId, id, JSON.stringify({ reason: 'Audit history preserved' })]
      );
      return { success: true, disabled: true, user: disabled[0] };
    }

    // Safe to hard delete sessions and user
    await this.db.query('DELETE FROM staff_session WHERE user_id = $1', [id]);
    const deleted = await this.db.query<StaffMember>(
      `DELETE FROM staff_user WHERE id = $1 RETURNING id, email, role, created_at, disabled_at`,
      [id]
    );
    if (!deleted[0]) throw new NotFoundException('Team member not found');

    await this.db.query(
      `INSERT INTO audit_event(actor_id, action, entity_type, entity_id, metadata)
       VALUES($1, 'delete_staff', 'staff_user', $2, $3)`,
      [actorId, id, JSON.stringify({ email: deleted[0].email })]
    );

    return { success: true, deleted: true, user: deleted[0] };
  }
}
