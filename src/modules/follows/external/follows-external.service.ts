import { Injectable } from '@nestjs/common';
import { Result } from 'neverthrow';
import { FollowCounts } from '../domain/follow';
import {
  GetFollowCountsError,
  GetFollowCountsHandler,
} from '../use-case/get-follow-counts/get-follow-counts.handler';

/**
 * The PORT of the follows module.
 *
 * It deliberately exposes ONLY the read side that neighbours need
 * (`getFollowCounts`). Mutations (follow / unfollow) stay behind the
 * presentation layer because no other module needs to trigger them.
 *
 * This service composes only follows' OWN use-case — so the follows port has
 * no path back to users, which is exactly what keeps the dependency graph
 * acyclic.
 */
@Injectable()
export class FollowsExternalService {
  constructor(
    private readonly getFollowCountsHandler: GetFollowCountsHandler,
  ) {}

  getFollowCounts(
    userId: string,
  ): Promise<Result<FollowCounts, GetFollowCountsError>> {
    return this.getFollowCountsHandler.run(userId);
  }
}
