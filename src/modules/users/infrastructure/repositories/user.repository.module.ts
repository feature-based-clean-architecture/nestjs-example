import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

/**
 * Registers the entity for THIS module only and exports the repository.
 * The entity never leaves this module — only `UserRepository` is exported.
 */
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UserRepositoryModule {}
