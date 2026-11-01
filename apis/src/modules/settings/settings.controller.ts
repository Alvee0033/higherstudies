import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { IsEmail, IsIn, IsString, Length, MinLength } from 'class-validator';
import { AdminGuard, StaffGuard, type StaffRequest } from '../auth/staff.guard.js';
import { SettingsService } from './settings.service.js';

class AddCountryDto {
  @IsString() @Length(2, 2) code!: string;
  @IsString() @MinLength(2) name!: string;
  @IsString() region!: string;
}

class CreateStaffDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(6) password!: string;
  @IsIn(['admin', 'editor']) role!: 'admin' | 'editor';
}

class UpdateRoleDto {
  @IsIn(['admin', 'editor']) role!: 'admin' | 'editor';
}

@Controller('v1/admin')
@UseGuards(StaffGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // --- SETTINGS (COUNTRIES & REGIONS) ---
  @Get('settings')
  async getSettings() {
    return { data: await this.settingsService.getAllSettings() };
  }

  @Get('audit-events')
  @UseGuards(AdminGuard)
  async listAuditEvents(@Query('limit') rawLimit?: string, @Query('offset') rawOffset?: string) {
    const limit = rawLimit === undefined ? 50 : Number(rawLimit);
    const offset = rawOffset === undefined ? 0 : Number(rawOffset);
    const data = await this.settingsService.listAuditEvents({ limit, offset });
    return { data, page: { limit, offset } };
  }

  @Put('settings/:key')
  @UseGuards(AdminGuard)
  async updateSetting(
    @Param('key') key: string,
    @Body() body: any,
    @Req() req: StaffRequest
  ) {
    return { data: await this.settingsService.updateSetting(key, body, req.staff.id) };
  }

  @Post('settings/countries')
  @UseGuards(AdminGuard)
  async addCountry(@Body() dto: AddCountryDto, @Req() req: StaffRequest) {
    return { data: await this.settingsService.addCountry(dto, req.staff.id) };
  }

  @Delete('settings/countries/:code')
  @UseGuards(AdminGuard)
  async removeCountry(@Param('code') code: string, @Req() req: StaffRequest) {
    return { data: await this.settingsService.removeCountry(code, req.staff.id) };
  }

  // --- STAFF & TEAM MANAGEMENT ---
  @Get('staff')
  async listStaff() {
    return { data: await this.settingsService.listStaff() };
  }

  @Post('staff')
  @UseGuards(AdminGuard)
  async createStaff(@Body() dto: CreateStaffDto, @Req() req: StaffRequest) {
    return { data: await this.settingsService.createStaff(dto, req.staff.id) };
  }

  @Patch('staff/:id')
  @UseGuards(AdminGuard)
  async updateRole(
    @Param('id') id: string,
    @Body() dto: UpdateRoleDto,
    @Req() req: StaffRequest
  ) {
    return { data: await this.settingsService.updateStaffRole(id, dto.role, req.staff.id) };
  }

  @Delete('staff/:id')
  @UseGuards(AdminGuard)
  async deleteStaff(@Param('id') id: string, @Req() req: StaffRequest) {
    return { data: await this.settingsService.deleteStaff(id, req.staff.id) };
  }
}
