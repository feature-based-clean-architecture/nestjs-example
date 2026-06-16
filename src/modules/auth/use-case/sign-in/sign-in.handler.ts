import { Injectable } from '@nestjs/common';
import { err, ok, Result } from 'neverthrow';
import { UsersExternalService } from '../../../users/external';
import { AuthSession } from '../../domain/auth-session';
import { PasswordHasher } from '../../infrastructure/security/password-hasher.service';
import { TokenService } from '../../infrastructure/security/token.service';

export type SignInError = 'INVALID_CREDENTIALS' | 'PERSISTENCE_ERROR';

@Injectable()
export class SignInHandler {
  constructor(
    private readonly usersExternalService: UsersExternalService,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
  ) {}

  async run(
    email: string,
    password: string,
  ): Promise<Result<AuthSession, SignInError>> {
    const found = await this.usersExternalService.getUserByEmail(email);
    if (found.isErr()) {
      return err('PERSISTENCE_ERROR');
    }

    const user = found.value;
    // Same error for "no such email" and "wrong password" — don't leak which
    // accounts exist.
    if (!user) {
      return err('INVALID_CREDENTIALS');
    }

    const matches = await this.passwordHasher.compare(
      password,
      user.passwordHash,
    );
    if (!matches) {
      return err('INVALID_CREDENTIALS');
    }

    const accessToken = await this.tokenService.issue({ userId: user.id });

    return ok({
      accessToken,
      user: { id: user.id, email: user.email, displayName: user.displayName },
    });
  }
}
