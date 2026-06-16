import { Module } from "@nestjs/common";
import { SignInHandler } from "./sign-in.handler";
import { HashModule } from "../../../../infrastructure/hash/hash.module";
import { UsersExternalModule } from "src/modules/users/external/users-external.module";

@Module({
  imports: [UsersExternalModule, HashModule],
  providers: [SignInHandler],
  exports: [SignInHandler],
})
export class SignInModule {}
