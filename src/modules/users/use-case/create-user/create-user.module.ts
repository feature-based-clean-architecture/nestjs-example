import { Module } from '@nestjs/common';
import { UserRepositoryModule } from '../../infrastructure/repositories/user.repository.module';
import { CreateUserHandler } from './create-user.handler';

@Module({
  imports: [UserRepositoryModule],
  providers: [CreateUserHandler],
  exports: [CreateUserHandler],
})
export class CreateUserModule {}
