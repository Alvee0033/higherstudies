import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';
import type {
  CreateEmailTrackerDto,
  UpdateEmailTrackerDto,
} from './student-email-tracker.dto.js';

const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const isoTimestamp = (value?: string) => {
  if (value === undefined) return null;
  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.getTime())) {
    throw new BadRequestException('Dates must be valid ISO timestamps');
  }
  return timestamp.toISOString();
};

@Injectable()
export class StudentEmailTrackerService {
  constructor(private readonly db: DatabaseService) {}

  async list(studentId: string, limitValue = '100', offsetValue = '0') {
    const limit = Number(limitValue);
    const offset = Number(offsetValue);
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new BadRequestException('limit must be 1-100');
    }
    if (!Number.isInteger(offset) || offset < 0 || offset > 100_000) {
      throw new BadRequestException('offset must be 0-100000');
    }
    const [data, totals] = await Promise.all([
      this.db.query(
        `SELECT e.id,e.faculty_member_id,e.professor_name,e.professor_title,e.email,
          e.institution_name,e.academic_unit,e.website,e.subject,e.sent_at,e.follow_up_at,
          e.replied_at,e.status,e.notes,e.created_at,e.updated_at,i.official_url AS institution_url
         FROM student_email_tracker e
         LEFT JOIN institution i ON lower(i.name)=lower(e.institution_name)
         WHERE e.student_id=$1
         ORDER BY e.created_at DESC,e.id DESC LIMIT $2 OFFSET $3`,
        [studentId, limit, offset],
      ),
      this.db.query<{ count: string }>(
        `SELECT count(*)::text AS count FROM student_email_tracker WHERE student_id=$1`,
        [studentId],
      ),
    ]);
    return {
      data,
      pagination: { total: Number(totals[0]?.count ?? 0), limit, offset },
    };
  }

  async create(studentId: string, dto: CreateEmailTrackerDto) {
    if (dto.facultyMemberId && !uuid.test(dto.facultyMemberId)) {
      throw new BadRequestException('Invalid facultyMemberId');
    }
    const rows = await this.db.query(
      `INSERT INTO student_email_tracker(
        student_id,faculty_member_id,professor_name,professor_title,email,
        institution_name,academic_unit,website,subject,sent_at,follow_up_at,
        replied_at,status,notes
      ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING id,faculty_member_id,professor_name,professor_title,email,
        institution_name,academic_unit,website,subject,sent_at,follow_up_at,
        replied_at,status,notes,created_at,updated_at`,
      [
        studentId,
        dto.facultyMemberId ?? null,
        dto.professorName.trim(),
        dto.professorTitle?.trim() || null,
        dto.email.trim().toLowerCase(),
        dto.institutionName.trim(),
        dto.academicUnit?.trim() || null,
        dto.website?.trim() || null,
        dto.subject?.trim() || null,
        isoTimestamp(dto.sentAt),
        isoTimestamp(dto.followUpAt),
        isoTimestamp(dto.repliedAt),
        dto.status ?? (dto.sentAt ? 'sent' : 'draft'),
        dto.notes?.trim() ?? '',
      ],
    );
    return { data: rows[0] };
  }

  async update(studentId: string, id: string, dto: UpdateEmailTrackerDto) {
    if (!uuid.test(id)) throw new BadRequestException('Invalid email tracker id');
    const fields = Object.keys(dto);
    if (!fields.length) throw new BadRequestException('At least one field is required');
    const rows = await this.db.query(
      `UPDATE student_email_tracker SET
        professor_name=COALESCE($3,professor_name),
        professor_title=COALESCE($4,professor_title),
        email=COALESCE($5,email),
        institution_name=COALESCE($6,institution_name),
        academic_unit=COALESCE($7,academic_unit),
        website=COALESCE($8,website),
        subject=COALESCE($9,subject),
        sent_at=CASE WHEN $10::boolean THEN $11::timestamptz ELSE sent_at END,
        follow_up_at=CASE WHEN $12::boolean THEN $13::timestamptz ELSE follow_up_at END,
        replied_at=CASE WHEN $14::boolean THEN $15::timestamptz ELSE replied_at END,
        status=COALESCE($16,status),notes=COALESCE($17,notes),updated_at=now()
       WHERE id=$1 AND student_id=$2
       RETURNING id,faculty_member_id,professor_name,professor_title,email,
        institution_name,academic_unit,website,subject,sent_at,follow_up_at,
        replied_at,status,notes,created_at,updated_at`,
      [
        id,
        studentId,
        dto.professorName?.trim() ?? null,
        dto.professorTitle?.trim() ?? null,
        dto.email?.trim().toLowerCase() ?? null,
        dto.institutionName?.trim() ?? null,
        dto.academicUnit?.trim() ?? null,
        dto.website?.trim() ?? null,
        dto.subject?.trim() ?? null,
        dto.sentAt !== undefined,
        isoTimestamp(dto.sentAt),
        dto.followUpAt !== undefined,
        isoTimestamp(dto.followUpAt),
        dto.repliedAt !== undefined,
        isoTimestamp(dto.repliedAt),
        dto.status ?? null,
        dto.notes?.trim() ?? null,
      ],
    );
    if (!rows[0]) throw new NotFoundException('Email tracker record not found');
    return { data: rows[0] };
  }

  async remove(studentId: string, id: string) {
    if (!uuid.test(id)) throw new BadRequestException('Invalid email tracker id');
    const rows = await this.db.query(
      `DELETE FROM student_email_tracker WHERE id=$1 AND student_id=$2 RETURNING id`,
      [id, studentId],
    );
    if (!rows[0]) throw new NotFoundException('Email tracker record not found');
    return { data: { id, deleted: true } };
  }
}
