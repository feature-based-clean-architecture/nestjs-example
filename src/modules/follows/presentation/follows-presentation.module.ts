import { Module } from '@nestjs/common';
import { FollowUserModule } from '../use-case/follow-user/follow-user.module';
import { UnfollowUserModule } from '../use-case/unfollow-user/unfollow-user.module';
import { FollowsController } from './follows.controller';
import { FollowsPresentationService } from './follows-presentation.service';

// JwtGuard (used by FollowsController) injects JwtService, which is provided
// globally by JwtModule in AppModule — no extra import needed here.
@Module({
  imports: [FollowUserModule, UnfollowUserModule],
  controllers: [FollowsController],
  providers: [FollowsPresentationService],
})
export class FollowsPresentationModule {}
