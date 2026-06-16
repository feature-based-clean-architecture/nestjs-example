import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FollowUserHandler } from '../use-case/follow-user/follow-user.handler';
import { UnfollowUserHandler } from '../use-case/unfollow-user/unfollow-user.handler';

@Injectable()
export class FollowsPresentationService {
  constructor(
    private readonly followUserHandler: FollowUserHandler,
    private readonly unfollowUserHandler: UnfollowUserHandler,
  ) {}

  async follow(followerId: string, followeeId: string): Promise<void> {
    const result = await this.followUserHandler.run(followerId, followeeId);
    if (result.isErr()) {
      switch (result.error) {
        case 'CANNOT_FOLLOW_SELF':
          throw new BadRequestException('You cannot follow yourself');
        case 'FOLLOWEE_NOT_FOUND':
          throw new NotFoundException('User to follow was not found');
        case 'ALREADY_FOLLOWING':
          throw new ConflictException('You already follow this user');
        default:
          throw new InternalServerErrorException();
      }
    }
  }

  async unfollow(followerId: string, followeeId: string): Promise<void> {
    const result = await this.unfollowUserHandler.run(followerId, followeeId);
    if (result.isErr()) {
      switch (result.error) {
        case 'NOT_FOLLOWING':
          throw new NotFoundException('You are not following this user');
        default:
          throw new InternalServerErrorException();
      }
    }
  }
}
