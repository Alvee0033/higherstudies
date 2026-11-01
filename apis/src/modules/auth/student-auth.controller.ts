import { Body, Controller, ForbiddenException, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { Throttle } from '@nestjs/throttler';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { StudentAuthService } from './student-auth.service.js';
import { StudentGuard, type StudentRequest } from './student.guard.js';

class StudentLoginDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(6) @MaxLength(128) password!: string;
}
export class StudentRegisterDto extends StudentLoginDto {
  @IsString() @MinLength(2) @MaxLength(100) displayName!: string;
}

export class PasswordDto { @IsString() @MaxLength(128) currentPassword!:string; @IsString() @MinLength(6) @MaxLength(128) newPassword!:string; }

@Controller('v1/student/auth')
export class StudentAuthController {
  constructor(private readonly auth: StudentAuthService) {}
  private setCookies(res: FastifyReply, session: { token: string; csrf: string }) {
    const options = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/', maxAge: 30 * 24 * 60 * 60 };
    res.setCookie('hs_student_session', session.token, options);
    res.setCookie('hs_student_csrf', session.csrf, { ...options, httpOnly: false });
  }

  @Post('register') @HttpCode(201)
  async register(@Body() dto: StudentRegisterDto, @Res({ passthrough: true }) res: FastifyReply) {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException('Registration is unavailable until email verification and recovery are implemented.');
    }
    const session = await this.auth.register(dto.email, dto.password, dto.displayName);
    this.setCookies(res, session);
    return { data: { ...session.user, token: session.token } };
  }

  @Post('login') @HttpCode(200)
  async login(@Body() dto: StudentLoginDto, @Res({ passthrough: true }) res: FastifyReply) {
    const session = await this.auth.login(dto.email, dto.password);
    this.setCookies(res, session);
    return { data: { ...session.user, token: session.token } };
  }

  @Post('password') @UseGuards(StudentGuard)
  async password(@Req() req:StudentRequest,@Body() body:PasswordDto,@Res({passthrough:true}) res:FastifyReply){
    await this.auth.changePassword(req.student.id,body.currentPassword,body.newPassword);
    res.clearCookie('hs_student_session',{path:'/'});res.clearCookie('hs_student_csrf',{path:'/'});
    return {data:{success:true}};
  }

  @Get('me') @UseGuards(StudentGuard)
  me(@Req() req: StudentRequest) { return { data: req.student }; }

  @Get('csrf') @UseGuards(StudentGuard)
  csrf(@Req() req: FastifyRequest) { return { data: { token: req.cookies?.hs_student_csrf ?? null } }; }

  @Post('logout') @UseGuards(StudentGuard) @HttpCode(200)
  async logout(@Req() req: FastifyRequest, @Res({ passthrough: true }) res: FastifyReply) {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
    await this.auth.logout(req.cookies?.hs_student_session || bearerToken);
    res.clearCookie('hs_student_session', { path: '/' });
    res.clearCookie('hs_student_csrf', { path: '/' });
    return { data: { success: true } };
  }
}
