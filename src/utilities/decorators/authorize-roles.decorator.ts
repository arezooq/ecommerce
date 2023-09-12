import { SetMetadata } from '@nestjs/common';
import { Roles } from '../user-roles.enum';

export const ROLES_KEY = 'roles';
export const AuthorizaRoles = (...roles: Roles[]) =>
  SetMetadata(ROLES_KEY, roles);
