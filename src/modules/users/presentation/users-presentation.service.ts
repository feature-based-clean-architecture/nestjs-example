import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FollowsExternalService } from '../../follows/external';
import { UsersExternalService } from '../external';
import { UserProfileResponse } from './dto/user-profile.response';

/**
 * The "users depends on follows" half of the old cycle — but it lives HERE, in
 * presentation, purely to enrich a response with follower counts.
 *
 * Because presentation is a sink (no module imports another module's
 * presentation for data), this dependency does not create an import cycle:
 *   users/presentation -> follows/external      (this file)
 *   follows/use-case    -> users/external        (follow-user.handler)
 * Neither external port imports the other, so the graph stays acyclic.
 */
@Injectable()
export class UsersPresentationService {
  constructor(
    private readonly usersExternalService: UsersExternalService,
    private readonly followsExternalService: FollowsExternalService,
  ) {}

  async getProfile(id: string): Promise<UserProfileResponse> {
    const userResult = await this.usersExternalService.getUserById(id);
    if (userResult.isErr()) {
      throw new InternalServerErrorException();
    }
    const user = userResult.value;
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const countsResult = await this.followsExternalService.getFollowCounts(id);
    if (countsResult.isErr()) {
      throw new InternalServerErrorException();
    }
    const counts = countsResult.value;

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt,
      followers: counts.followers,
      following: counts.following,
    };
  }
}
