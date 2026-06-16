import { Module } from '@nestjs/common';
import { UsersExternalModule } from '../../../users/external';
import { HashModule } from '../../infrastructure/security/hash.module';
import { TokenModule } from '../../infrastructure/security/token.module';
import { SignUpHandler } from './sign-up.handler';

@Module({
  imports: [UsersExternalModule, HashModule, TokenModule],
  providers: [SignUpHandler],
  exports: [SignUpHandler],
})
export class SignUpModule {}
