import { Module } from '@nestjs/common';
import { UsersExternalModule } from '../../../users/external';
import { HashModule } from '../../infrastructure/security/hash.module';
import { TokenModule } from '../../infrastructure/security/token.module';
import { SignInHandler } from './sign-in.handler';

@Module({
  imports: [UsersExternalModule, HashModule, TokenModule],
  providers: [SignInHandler],
  exports: [SignInHandler],
})
export class SignInModule {}
