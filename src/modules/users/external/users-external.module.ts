import { Module } from "@nestjs/common";
import { CreateUserModule } from "../use-case/create-user/create-user.module";
import { GetUserByEmailModule } from "../use-case/get-user-by-email/get-user-by-email.module";
import { GetUserByIdModule } from "../use-case/get-user-by-id/get-user-by-id.module";
import { UsersExternalService } from "./users-external.service";

@Module({
  imports: [CreateUserModule, GetUserByEmailModule, GetUserByIdModule],
  providers: [UsersExternalService],
  exports: [UsersExternalService],
})
export class UsersExternalModule {}
