import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/users/decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    console.log('request', request);
    const user = request.user;
    return this.matchRoles(roles, user.roles);
  }

  private matchRoles(roles: string[], userRoles: string) {
    if (roles.includes(userRoles)) {
      return true;
    }

    return false;
  }
}
