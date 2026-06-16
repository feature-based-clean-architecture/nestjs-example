import { Controller, Get, Param, ParseUUIDPipe } from "@nestjs/common";
import { UserProfileDtoRes } from "./dto/user-profile.dto";
import { UsersPresentationService } from "./users-presentation.service";

@Controller("users")
export class UsersPresentationController {
  constructor(
    private readonly usersPresentationService: UsersPresentationService,
  ) {}

  @Get(":id")
  async getProfile(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<UserProfileDtoRes> {
    return this.usersPresentationService.getProfile(id);
  }
}
