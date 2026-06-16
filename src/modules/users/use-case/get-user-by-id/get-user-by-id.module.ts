import { Module } from '@nestjs/common';
import { UserRepositoryModule } from '../../infrastructure/repositories/user.repository.module';
import { GetUserByIdHandler } from './get-user-by-id.handler';

@Module({
  imports: [UserRepositoryModule],
  providers: [GetUserByIdHandler],
  exports: [GetUserByIdHandler],
})
export class GetUserByIdModule {}
