import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { err, ok, Result } from 'neverthrow';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateUserData, User } from '../../domain/user';
import { UserEntity } from './user.entity';

/** Postgres unique-violation error code. */
const PG_UNIQUE_VIOLATION = '23505';

export type UserRepositoryError = 'EMAIL_ALREADY_EXISTS' | 'PERSISTENCE_ERROR';

/**
 * The only component allowed to see `UserEntity`. It speaks domain `User` to
 * the rest of the module and keeps all ORM concerns (mapping, error codes)
 * behind a Result-returning interface.
 */
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
  ) {}

  async create(
    data: CreateUserData,
  ): Promise<Result<User, UserRepositoryError>> {
    try {
      const entity = this.users.create(data);
      const saved = await this.users.save(entity);
      return ok(this.toDomain(saved));
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as unknown as { code?: string }).code === PG_UNIQUE_VIOLATION
      ) {
        return err('EMAIL_ALREADY_EXISTS');
      }
      return err('PERSISTENCE_ERROR');
    }
  }

  async findByEmail(
    email: string,
  ): Promise<Result<User | undefined, UserRepositoryError>> {
    try {
      const entity = await this.users.findOne({ where: { email } });
      return ok(entity ? this.toDomain(entity) : undefined);
    } catch {
      return err('PERSISTENCE_ERROR');
    }
  }

  async findById(
    id: string,
  ): Promise<Result<User | undefined, UserRepositoryError>> {
    try {
      const entity = await this.users.findOne({ where: { id } });
      return ok(entity ? this.toDomain(entity) : undefined);
    } catch {
      return err('PERSISTENCE_ERROR');
    }
  }

  /** Entity -> Domain. The boundary where the ORM stops existing. */
  private toDomain(entity: UserEntity): User {
    return {
      id: entity.id,
      email: entity.email,
      passwordHash: entity.passwordHash,
      displayName: entity.displayName,
      createdAt: entity.createdAt,
    };
  }
}
