import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowEntity } from './follow.entity';
import { FollowRepository } from './follow.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FollowEntity])],
  providers: [FollowRepository],
  exports: [FollowRepository],
})
export class FollowRepositoryModule {}
