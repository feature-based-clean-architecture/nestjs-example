import { Module } from "@nestjs/common";
import { HashModule } from "../../../../infrastructure/hash/hash.module";
import { SignUpHandler } from "./sign-up.handler";
import { UsersExternalModule } from "src/modules/users/external/users-external.module";

@Module({
  imports: [UsersExternalModule, HashModule],
  providers: [SignUpHandler],
  exports: [SignUpHandler],
})
export class SignUpModule {}
