import { Module } from '@nestjs/common';
import { TokenModule } from '../../infrastructure/security/token.module';
import { VerifyTokenHandler } from './verify-token.handler';

@Module({
  imports: [TokenModule],
  providers: [VerifyTokenHandler],
  exports: [VerifyTokenHandler],
})
export class VerifyTokenModule {}
