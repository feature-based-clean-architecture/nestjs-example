import { Module } from '@nestjs/common';
import { UsersExternalModule } from '../../../users/external';
import { PasswordHasherModule } from '../../infrastructure/security/password-hasher.module';
import { TokenModule } from '../../infrastructure/security/token.module';
import { SignInHandler } from './sign-in.handler';

@Module({
  imports: [UsersExternalModule, PasswordHasherModule, TokenModule],
  providers: [SignInHandler],
  exports: [SignInHandler],
})
export class SignInModule {}
