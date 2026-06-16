import { Module } from "@nestjs/common";
import { FollowsExternalModule } from "../../follows/external";
import { UsersPresentationController } from "./users-presentation.controller";
import { UsersPresentationService } from "./users-presentation.service";
import { GetUserByIdModule } from "../use-case/get-user-by-id/get-user-by-id.module";

@Module({
  imports: [GetUserByIdModule, FollowsExternalModule],
  controllers: [UsersPresentationController],
  providers: [UsersPresentationService],
})
export class UsersPresentationModule {}
