import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export const EMAIL_TRACKER_STATUSES = [
  'draft',
  'sent',
  'waiting',
  'positive_reply',
  'negative_reply',
  'interview',
] as const;
export type EmailTrackerStatus = (typeof EMAIL_TRACKER_STATUSES)[number];

export class CreateEmailTrackerDto {
  @IsOptional() @IsUUID('4') facultyMemberId?: string;
  @IsString() @MinLength(2) @MaxLength(150) professorName!: string;
  @IsOptional() @IsString() @MaxLength(150) professorTitle?: string;
  @IsEmail() @MaxLength(254) email!: string;
  @IsString() @MinLength(2) @MaxLength(200) institutionName!: string;
  @IsOptional() @IsString() @MaxLength(200) academicUnit?: string;
  @IsOptional() @IsString() @MaxLength(2048) website?: string;
  @IsOptional() @IsString() @MaxLength(300) subject?: string;
  @IsOptional() @IsString() @MaxLength(50) sentAt?: string;
  @IsOptional() @IsString() @MaxLength(50) followUpAt?: string;
  @IsOptional() @IsString() @MaxLength(50) repliedAt?: string;
  @IsOptional() @IsIn(EMAIL_TRACKER_STATUSES) status?: EmailTrackerStatus;
  @IsOptional() @IsString() @MaxLength(5000) notes?: string;
}

export class UpdateEmailTrackerDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(150) professorName?: string;
  @IsOptional() @IsString() @MaxLength(150) professorTitle?: string;
  @IsOptional() @IsEmail() @MaxLength(254) email?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(200) institutionName?: string;
  @IsOptional() @IsString() @MaxLength(200) academicUnit?: string;
  @IsOptional() @IsString() @MaxLength(2048) website?: string;
  @IsOptional() @IsString() @MaxLength(300) subject?: string;
  @IsOptional() @IsString() @MaxLength(50) sentAt?: string;
  @IsOptional() @IsString() @MaxLength(50) followUpAt?: string;
  @IsOptional() @IsString() @MaxLength(50) repliedAt?: string;
  @IsOptional() @IsIn(EMAIL_TRACKER_STATUSES) status?: EmailTrackerStatus;
  @IsOptional() @IsString() @MaxLength(5000) notes?: string;
}
