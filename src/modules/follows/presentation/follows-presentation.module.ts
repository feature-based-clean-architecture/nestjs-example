import { Module } from '@nestjs/common';
import { AuthGuardModule } from '../../auth/presentation/guards/auth-guard.module';
import { FollowUserModule } from '../use-case/follow-user/follow-user.module';
import { UnfollowUserModule } from '../use-case/unfollow-user/unfollow-user.module';
import { FollowsController } from './follows.controller';
import { FollowsPresentationService } from './follows-presentation.service';

@Module({
  imports: [FollowUserModule, UnfollowUserModule, AuthGuardModule],
  controllers: [FollowsController],
  providers: [FollowsPresentationService],
})
export class FollowsPresentationModule {}
