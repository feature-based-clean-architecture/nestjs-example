import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { UserProfileResponse } from './dto/user-profile.response';
import { UsersPresentationService } from './users-presentation.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersPresentationService: UsersPresentationService,
  ) {}

  @Get(':id')
  getProfile(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserProfileResponse> {
    return this.usersPresentationService.getProfile(id);
  }
}
