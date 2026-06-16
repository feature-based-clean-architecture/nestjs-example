import { Module } from '@nestjs/common';
import { VerifyTokenModule } from '../../use-case/verify-token/verify-token.module';
import { JwtAuthGuard } from './jwt-auth.guard';

/**
 * The reusable authentication boundary. Other modules' presentation layers
 * import THIS to protect their routes (see follows). It is the one piece of
 * auth that other modules are allowed to import — and it is presentation, not
 * a use-case or infrastructure.
 */
@Module({
  imports: [VerifyTokenModule],
  providers: [JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AuthGuardModule {}
