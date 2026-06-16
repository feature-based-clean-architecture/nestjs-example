import { Injectable } from '@nestjs/common';
import { Result } from 'neverthrow';
import { User } from '../../domain/user';
import {
  UserRepository,
  UserRepositoryError,
} from '../../infrastructure/repositories/user.repository';

export type GetUserByIdError = UserRepositoryError;

@Injectable()
export class GetUserByIdHandler {
  constructor(private readonly userRepository: UserRepository) {}

  run(id: string): Promise<Result<User | undefined, GetUserByIdError>> {
    return this.userRepository.findById(id);
  }
}
