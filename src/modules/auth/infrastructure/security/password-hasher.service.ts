import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

/**
 * Infrastructure detail: how a password becomes a hash. Use-cases depend on
 * this capability, never on `bcrypt` directly.
 */
@Injectable()
export class PasswordHasher {
  private readonly rounds = 10;

  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.rounds);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
