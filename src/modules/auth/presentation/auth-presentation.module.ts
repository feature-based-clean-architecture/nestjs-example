import { Module } from '@nestjs/common';
import { SignInModule } from '../use-case/sign-in/sign-in.module';
import { SignUpModule } from '../use-case/sign-up/sign-up.module';
import { AuthController } from './auth.controller';
import { AuthPresentationService } from './auth-presentation.service';

@Module({
  imports: [SignUpModule, SignInModule],
  controllers: [AuthController],
  providers: [AuthPresentationService],
})
export class AuthPresentationModule {}
