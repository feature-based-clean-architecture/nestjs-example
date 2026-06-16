import { Module } from '@nestjs/common';
import { FollowsExternalModule } from '../../follows/external';
import { UsersExternalModule } from '../external';
import { UsersController } from './users.controller';
import { UsersPresentationService } from './users-presentation.service';

@Module({
  imports: [UsersExternalModule, FollowsExternalModule],
  controllers: [UsersController],
  providers: [UsersPresentationService],
})
export class UsersPresentationModule {}
