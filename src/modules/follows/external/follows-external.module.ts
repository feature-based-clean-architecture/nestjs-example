import { Module } from '@nestjs/common';
import { GetFollowCountsModule } from '../use-case/get-follow-counts/get-follow-counts.module';
import { FollowsExternalService } from './follows-external.service';

/**
 * Imports ONLY follows' own use-case. It never imports `users`, so
 * `FollowsExternalModule` cannot be part of an import cycle — the users
 * presentation layer can safely depend on it.
 */
@Module({
  imports: [GetFollowCountsModule],
  providers: [FollowsExternalService],
  exports: [FollowsExternalService],
})
export class FollowsExternalModule {}
