import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { AuthService, type StaffIdentity } from './auth.service.js';

export type StaffRequest = FastifyRequest & { staff: StaffIdentity };

@Injectable()
export class StaffGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<StaffRequest>();
    const token = req.cookies?.hs_admin_session;
    const session = await this.auth.authenticate(token);
    req.staff = session.user;
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) this.auth.verifyCsrf(session.csrfHash, req.headers['x-csrf-token'] as string | undefined);
    return true;
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<StaffRequest>();
    if (!req.staff) throw new UnauthorizedException();
    if (req.staff.role !== 'admin') throw new ForbiddenException('Admin role required');
    return true;
  }
}
