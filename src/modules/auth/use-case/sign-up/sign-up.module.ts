import { Module } from '@nestjs/common';
import { UsersExternalModule } from '../../../users/external';
import { PasswordHasherModule } from '../../infrastructure/security/password-hasher.module';
import { TokenModule } from '../../infrastructure/security/token.module';
import { SignUpHandler } from './sign-up.handler';

@Module({
  imports: [UsersExternalModule, PasswordHasherModule, TokenModule],
  providers: [SignUpHandler],
  exports: [SignUpHandler],
})
export class SignUpModule {}
