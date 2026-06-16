import { Injectable } from '@nestjs/common';
import { err, ok, Result } from 'neverthrow';
import { UsersExternalService } from '../../../users/external';
import { Follow } from '../../domain/follow';
import { FollowRepository } from '../../infrastructure/repositories/follow.repository';

export type FollowUserError =
  | 'CANNOT_FOLLOW_SELF'
  | 'FOLLOWEE_NOT_FOUND'
  | 'ALREADY_FOLLOWING'
  | 'PERSISTENCE_ERROR';

/**
 * The "follows depends on users" half of the old cycle.
 *
 * It validates that the target user exists by going through the users PORT
 * (`UsersExternalService.getUserById`). It does NOT import the users
 * repository, entity, or domain. This is a business rule, so the dependency
 * correctly lives in the use-case layer.
 */
@Injectable()
export class FollowUserHandler {
  constructor(
    private readonly followRepository: FollowRepository,
    private readonly usersExternalService: UsersExternalService,
  ) {}

  async run(
    followerId: string,
    followeeId: string,
  ): Promise<Result<Follow, FollowUserError>> {
    if (followerId === followeeId) {
      return err('CANNOT_FOLLOW_SELF');
    }

    const followee = await this.usersExternalService.getUserById(followeeId);
    if (followee.isErr()) {
      return err('PERSISTENCE_ERROR');
    }
    if (!followee.value) {
      return err('FOLLOWEE_NOT_FOUND');
    }

    const created = await this.followRepository.create(followerId, followeeId);
    if (created.isErr()) {
      return err(created.error);
    }

    return ok(created.value);
  }
}
