import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { AdminGuard, StaffGuard } from './staff.guard.js';
import { StudentAuthController } from './student-auth.controller.js';
import { StudentAuthService } from './student-auth.service.js';
import { StudentGuard } from './student.guard.js';

@Module({ controllers: [AuthController, StudentAuthController], providers: [AuthService, StaffGuard, AdminGuard, StudentAuthService, StudentGuard], exports: [AuthService, StaffGuard, AdminGuard, StudentAuthService, StudentGuard] })
export class AuthModule {}
