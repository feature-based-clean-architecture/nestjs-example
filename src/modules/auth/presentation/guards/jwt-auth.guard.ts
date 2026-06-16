import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { VerifyTokenHandler } from '../../use-case/verify-token/verify-token.handler';

export type AuthenticatedUser = { userId: string };

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

/**
 * Cross-cutting HTTP concern, so it lives in presentation. It delegates the
 * actual token check to the auth module's own use-case (`VerifyTokenHandler`),
 * never to `TokenService` directly — presentation does not reach into
 * infrastructure.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly verifyTokenHandler: VerifyTokenHandler) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const result = await this.verifyTokenHandler.run(token);
    if (result.isErr()) {
      throw new UnauthorizedException('Invalid token');
    }

    request.user = { userId: result.value.userId };
    return true;
  }

  private extractToken(request: AuthenticatedRequest): string | undefined {
    const header = request.headers.authorization;
    if (!header) {
      return undefined;
    }
    const [scheme, value] = header.split(' ');
    return scheme === 'Bearer' ? value : undefined;
  }
}
