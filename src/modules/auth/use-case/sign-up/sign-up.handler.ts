import { Injectable } from '@nestjs/common';
import { err, ok, Result } from 'neverthrow';
import { UsersExternalService } from '../../../users/external';
import { AuthSession } from '../../domain/auth-session';
import { HashService } from '../../infrastructure/security/hash.service';
import { TokenService } from '../../infrastructure/security/token.service';

export type SignUpError =
  | 'EMAIL_ALREADY_EXISTS'
  | 'HASHING_FAILED'
  | 'PERSISTENCE_ERROR';

/**
 * Cross-module orchestration done right: the auth use-case reaches the users
 * module ONLY through `UsersExternalService` (its port). It has no idea a
 * `UserRepository` or `UserEntity` exists.
 */
@Injectable()
export class SignUpHandler {
  constructor(
    private readonly usersExternalService: UsersExternalService,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
  ) {}

  async run(
    email: string,
    password: string,
    displayName: string,
  ): Promise<Result<AuthSession, SignUpError>> {
    const existing = await this.usersExternalService.getUserByEmail(email);
    if (existing.isErr()) {
      return err('PERSISTENCE_ERROR');
    }
    if (existing.value) {
      return err('EMAIL_ALREADY_EXISTS');
    }

    const hashResult = await this.hashService.hash(password);
    if (hashResult.isErr()) {
      // scrypt failed (RNG / key derivation) — an internal infra failure.
      return err('HASHING_FAILED');
    }

    const created = await this.usersExternalService.createUser({
      email,
      passwordHash: hashResult.value,
      displayName,
    });
    if (created.isErr()) {
      // Covers the create-time race where the unique constraint fires.
      return err(created.error);
    }

    const user = created.value;
    const accessToken = await this.tokenService.issue({ userId: user.id });

    return ok({
      accessToken,
      user: { id: user.id, email: user.email, displayName: user.displayName },
    });
  }
}
