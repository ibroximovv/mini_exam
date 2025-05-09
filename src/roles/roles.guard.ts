import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from 'src/common/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector){}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if(!requiredRoles) {
      return true
    }
    const { user } = context.switchToHttp().getRequest();
    console.log(user.role, requiredRoles);
    
    return requiredRoles.some(( role ) => user.role?.includes(role));
  }
}
