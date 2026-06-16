import { Module } from "@nestjs/common";
import { SignInModule } from "../use-case/sign-in/sign-in.module";
import { SignUpModule } from "../use-case/sign-up/sign-up.module";
import { AuthPresentationService } from "./auth-presentation.service";
import { AuthPresentationController } from "./auth-presentation.controller";

@Module({
  imports: [SignUpModule, SignInModule],
  controllers: [AuthPresentationController],
  providers: [AuthPresentationService],
})
export class AuthPresentationModule {}
