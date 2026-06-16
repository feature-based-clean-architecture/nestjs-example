import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { err, ok, Result } from 'neverthrow';

export type TokenPayload = { userId: string };

export type VerifyTokenError = 'INVALID_TOKEN';

/**
 * Infrastructure detail: how an identity is encoded into / decoded from a JWT.
 * Wraps `@nestjs/jwt` so the rest of the module speaks `TokenPayload` and
 * Result, not jsonwebtoken exceptions.
 */
@Injectable()
export class TokenService {
  constructor(private readonly jwt: JwtService) {}

  issue(payload: TokenPayload): Promise<string> {
    return this.jwt.signAsync(payload);
  }

  async verify(token: string): Promise<Result<TokenPayload, VerifyTokenError>> {
    try {
      const payload = await this.jwt.verifyAsync<TokenPayload>(token);
      return ok({ userId: payload.userId });
    } catch {
      return err('INVALID_TOKEN');
    }
  }
}
