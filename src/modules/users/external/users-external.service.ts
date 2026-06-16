import { Injectable } from '@nestjs/common';
import { Result } from 'neverthrow';
import { CreateUserData, User } from '../domain/user';
import {
  CreateUserError,
  CreateUserHandler,
} from '../use-case/create-user/create-user.handler';
import {
  GetUserByEmailError,
  GetUserByEmailHandler,
} from '../use-case/get-user-by-email/get-user-by-email.handler';
import {
  GetUserByIdError,
  GetUserByIdHandler,
} from '../use-case/get-user-by-id/get-user-by-id.handler';

/**
 * The PORT of the users module — its public contract (Part 4).
 *
 * Neighbour modules (auth, follows) are allowed to import ONLY this service.
 * They never see the repository, the entity, or the individual handlers. This
 * "artificial network boundary inside the monolith" is what lets the module be
 * refactored — or extracted into a microservice — without touching callers.
 */
@Injectable()
export class UsersExternalService {
  constructor(
    private readonly createUserHandler: CreateUserHandler,
    private readonly getUserByEmailHandler: GetUserByEmailHandler,
    private readonly getUserByIdHandler: GetUserByIdHandler,
  ) {}

  createUser(data: CreateUserData): Promise<Result<User, CreateUserError>> {
    return this.createUserHandler.run(data);
  }

  getUserByEmail(
    email: string,
  ): Promise<Result<User | undefined, GetUserByEmailError>> {
    return this.getUserByEmailHandler.run(email);
  }

  getUserById(
    id: string,
  ): Promise<Result<User | undefined, GetUserByIdError>> {
    return this.getUserByIdHandler.run(id);
  }
}
