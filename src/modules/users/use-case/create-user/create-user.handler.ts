import { Injectable } from '@nestjs/common';
import { err, ok, Result } from 'neverthrow';
import { CreateUserData, User } from '../../domain/user';
import { UserRepository } from '../../infrastructure/repositories/user.repository';

export type CreateUserError = 'EMAIL_ALREADY_EXISTS' | 'PERSISTENCE_ERROR';

/**
 * One handler = one use-case (Part 4). It orchestrates domain + infrastructure
 * and returns a typed Result. It knows nothing about HTTP.
 */
@Injectable()
export class CreateUserHandler {
  constructor(private readonly userRepository: UserRepository) {}

  async run(data: CreateUserData): Promise<Result<User, CreateUserError>> {
    const created = await this.userRepository.create(data);

    if (created.isErr()) {
      // Repository error codes happen to line up 1:1 here, but the mapping is
      // explicit on purpose: the use-case owns its own error vocabulary.
      return err(created.error);
    }

    return ok(created.value);
  }
}
