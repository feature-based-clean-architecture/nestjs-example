import { Module } from '@nestjs/common';
import { UserRepositoryModule } from '../../infrastructure/repositories/user.repository.module';
import { GetUserByEmailHandler } from './get-user-by-email.handler';

@Module({
  imports: [UserRepositoryModule],
  providers: [GetUserByEmailHandler],
  exports: [GetUserByEmailHandler],
})
export class GetUserByEmailModule {}
