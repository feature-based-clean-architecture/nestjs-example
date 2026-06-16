import { Module } from '@nestjs/common';
import { UsersExternalModule } from '../../../users/external';
import { HashModule } from '../../../../infrastructure/hash/hash.module';
import { SignUpHandler } from './sign-up.handler';

@Module({
  imports: [UsersExternalModule, HashModule],
  providers: [SignUpHandler],
  exports: [SignUpHandler],
})
export class SignUpModule {}
