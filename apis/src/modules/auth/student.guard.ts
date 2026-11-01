import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { StudentAuthService, type StudentIdentity } from './student-auth.service.js';

export type StudentRequest = FastifyRequest & { student: StudentIdentity };

@Injectable()
export class StudentGuard implements CanActivate {
  constructor(private readonly auth: StudentAuthService) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<StudentRequest>();
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
    const cookieToken = req.cookies?.hs_student_session;
    const token = cookieToken || bearerToken;
    const session = await this.auth.authenticate(token);
    req.student = session.user;
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && cookieToken && !bearerToken) {
      this.auth.verifyCsrf(session.csrfHash, req.headers['x-csrf-token'] as string | undefined);
    }
    return true;
  }
}
