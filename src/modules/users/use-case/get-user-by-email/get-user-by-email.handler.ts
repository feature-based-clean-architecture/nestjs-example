import { Injectable } from '@nestjs/common';
import { Result } from 'neverthrow';
import { User } from '../../domain/user';
import {
  UserRepository,
  UserRepositoryError,
} from '../../infrastructure/repositories/user.repository';

export type GetUserByEmailError = UserRepositoryError;

@Injectable()
export class GetUserByEmailHandler {
  constructor(private readonly userRepository: UserRepository) {}

  run(email: string): Promise<Result<User | undefined, GetUserByEmailError>> {
    return this.userRepository.findByEmail(email);
  }
}
