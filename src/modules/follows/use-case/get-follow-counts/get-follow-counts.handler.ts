import { Injectable } from '@nestjs/common';
import { Result } from 'neverthrow';
import { FollowCounts } from '../../domain/follow';
import { FollowRepository } from '../../infrastructure/repositories/follow.repository';

export type GetFollowCountsError = 'PERSISTENCE_ERROR';

/**
 * Read-only counts. This is the use-case that the follows PORT exposes so the
 * users module can enrich a profile WITHOUT follows ever importing users back
 * at the port level. (See `follows/external`.)
 */
@Injectable()
export class GetFollowCountsHandler {
  constructor(private readonly followRepository: FollowRepository) {}

  run(userId: string): Promise<Result<FollowCounts, GetFollowCountsError>> {
    return this.followRepository.getCounts(userId);
  }
}
