import { Injectable } from '@nestjs/common';
import { Result } from 'neverthrow';
import {
  TokenPayload,
  TokenService,
  VerifyTokenError,
} from '../../infrastructure/security/token.service';

/**
 * Used by the auth guard to turn a raw bearer token into an identity. Kept as a
 * use-case (not called directly from the guard's infrastructure) so the guard
 * depends on the module's own use-case layer, not on `TokenService` directly.
 */
@Injectable()
export class VerifyTokenHandler {
  constructor(private readonly tokenService: TokenService) {}

  run(token: string): Promise<Result<TokenPayload, VerifyTokenError>> {
    return this.tokenService.verify(token);
  }
}
