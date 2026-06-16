import { Module } from '@nestjs/common';
import { FollowRepositoryModule } from '../../infrastructure/repositories/follow.repository.module';
import { UnfollowUserHandler } from './unfollow-user.handler';

@Module({
  imports: [FollowRepositoryModule],
  providers: [UnfollowUserHandler],
  exports: [UnfollowUserHandler],
})
export class UnfollowUserModule {}
