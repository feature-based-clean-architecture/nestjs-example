import { Module } from '@nestjs/common';
import { CreateUserModule } from '../use-case/create-user/create-user.module';
import { GetUserByEmailModule } from '../use-case/get-user-by-email/get-user-by-email.module';
import { GetUserByIdModule } from '../use-case/get-user-by-id/get-user-by-id.module';
import { UsersExternalService } from './users-external.service';

/**
 * Composes the module's use-cases behind the public port.
 *
 * Crucially, this module imports ONLY users' own use-cases. It does not import
 * `follows` or `auth`, so `UsersExternalModule` can never be part of an import
 * cycle. See README "How FBCA kills the cycle".
 */
@Module({
  imports: [CreateUserModule, GetUserByEmailModule, GetUserByIdModule],
  providers: [UsersExternalService],
  exports: [UsersExternalService],
})
export class UsersExternalModule {}
