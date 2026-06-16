import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest, AuthenticatedUser } from './jwt-auth.guard';

/**
 * Pulls the identity attached by `JwtAuthGuard`. Only valid on routes guarded
 * by it.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser => {
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();
    if (!request.user) {
      throw new Error('@CurrentUser() used on a route without JwtAuthGuard');
    }
    return request.user;
  },
);
