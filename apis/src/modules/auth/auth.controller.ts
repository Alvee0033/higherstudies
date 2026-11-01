import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { SkipThrottle } from '@nestjs/throttler';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from './auth.service.js';
import { StaffGuard, type StaffRequest } from './staff.guard.js';

class LoginDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(1) password!: string;
}

@SkipThrottle()
@Controller('v1/admin/auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login') @HttpCode(200) @SkipThrottle()
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: FastifyReply) {
    const result = await this.auth.login(dto.email, dto.password);
    res.setCookie('hs_admin_session', result.token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 12 * 60 * 60 });
    res.setCookie('hs_admin_csrf', result.csrf, { httpOnly: false, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 12 * 60 * 60 });
    return { data: result.user };
  }

  @Get('me') @UseGuards(StaffGuard)
  me(@Req() req: StaffRequest) { return { data: req.staff }; }

  @Get('csrf') @UseGuards(StaffGuard)
  csrf(@Req() req: FastifyRequest) { return { data: { token: req.cookies?.hs_admin_csrf ?? null } }; }

  @Post('logout') @UseGuards(StaffGuard) @HttpCode(200)
  async logout(@Req() req: FastifyRequest, @Res({ passthrough: true }) res: FastifyReply) {
    await this.auth.logout(req.cookies?.hs_admin_session);
    res.clearCookie('hs_admin_session', { path: '/' });
    res.clearCookie('hs_admin_csrf', { path: '/' });
    return { data: { success: true } };
  }
}
