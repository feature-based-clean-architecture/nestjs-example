import { Module } from '@nestjs/common';
import { UsersExternalModule } from '../../../users/external';
import { FollowRepositoryModule } from '../../infrastructure/repositories/follow.repository.module';
import { FollowUserHandler } from './follow-user.handler';

@Module({
  imports: [FollowRepositoryModule, UsersExternalModule],
  providers: [FollowUserHandler],
  exports: [FollowUserHandler],
})
export class FollowUserModule {}
