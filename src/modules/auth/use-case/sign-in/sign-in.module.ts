import { Module } from "@nestjs/common";
import { UsersExternalModule } from "../../../users/external";
import { SignInHandler } from "./sign-in.handler";
import { HashModule } from "src/infrastructure/hash/hash.module";

@Module({
  imports: [UsersExternalModule, HashModule],
  providers: [SignInHandler],
  exports: [SignInHandler],
})
export class SignInModule {}
