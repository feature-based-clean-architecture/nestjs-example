import { Injectable } from '@nestjs/common';
import { err, ok, Result } from 'neverthrow';
import { FollowRepository } from '../../infrastructure/repositories/follow.repository';

export type UnfollowUserError = 'NOT_FOLLOWING' | 'PERSISTENCE_ERROR';

@Injectable()
export class UnfollowUserHandler {
  constructor(private readonly followRepository: FollowRepository) {}

  async run(
    followerId: string,
    followeeId: string,
  ): Promise<Result<void, UnfollowUserError>> {
    const deleted = await this.followRepository.delete(followerId, followeeId);
    if (deleted.isErr()) {
      return err('PERSISTENCE_ERROR');
    }
    if (!deleted.value) {
      return err('NOT_FOLLOWING');
    }

    return ok(undefined);
  }
}
