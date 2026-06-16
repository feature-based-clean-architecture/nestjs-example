import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { FollowsExternalService } from "../../follows/external";
import { UserProfileDtoRes } from "./dto/user-profile.dto";
import { GetUserByIdHandler } from "../use-case/get-user-by-id/get-user-by-id.handler";

@Injectable()
export class UsersPresentationService {
  constructor(
    private readonly getUserByIdHandler: GetUserByIdHandler,
    private readonly followsExternalService: FollowsExternalService,
  ) {}

  async getProfile(id: string): Promise<UserProfileDtoRes> {
    const getUserResult = await this.getUserByIdHandler.run({ id });
    if (getUserResult.isErr()) {
      throw new InternalServerErrorException();
    }

    const user = getUserResult.value;
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const getFollowCountsResult =
      await this.followsExternalService.getFollowCounts(id);
    if (getFollowCountsResult.isErr()) {
      throw new InternalServerErrorException();
    }

    const counts = getFollowCountsResult.value;

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt,
      followers: counts.followers,
      following: counts.following,
    };
  }
}
