import { Module } from '@nestjs/common';
import { FollowRepositoryModule } from '../../infrastructure/repositories/follow.repository.module';
import { GetFollowCountsHandler } from './get-follow-counts.handler';

@Module({
  imports: [FollowRepositoryModule],
  providers: [GetFollowCountsHandler],
  exports: [GetFollowCountsHandler],
})
export class GetFollowCountsModule {}
