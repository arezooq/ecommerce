import {
  CanActivate,
  ExecutionContext,
  // Injectable,
  UnauthorizedException,
  mixin,
} from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
import { Roles } from '../user-roles.enum';
// import { ROLES_KEY } from '../decorators/authorize-roles.decorator';
// import { Observable } from 'rxjs';

// @Injectable()
// export class AuthorizeGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);
//     if (!requiredRoles) {
//       return true;
//     }
//     const request = context.switchToHttp().getRequest();
//     const userRoles: Roles[] = request.currentUser.roles;
//     const isAuthorized = requiredRoles.some((role) =>
//       userRoles?.includes(role),
//     );
//     if (isAuthorized) {
//       return true;
//     }
//     throw new UnauthorizedException('Sorry, you are not authorized');
//   }
// }

export const AuthorizeGuard = (allowedRoles: Roles[]) => {
  class RolesGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const userRoles: Roles[] = request.currentUser.roles;
      const isAuthorized = allowedRoles.some((role) =>
        userRoles?.includes(role),
      );
      if (isAuthorized) {
        return true;
      }
      throw new UnauthorizedException('Sorry, you are not authorized');
    }
  }
  const guard = mixin(RolesGuardMixin);
  return guard;
};
