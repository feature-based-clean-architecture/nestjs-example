import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../auth/presentation/guards/current-user.decorator';
import {
  AuthenticatedUser,
  JwtAuthGuard,
} from '../../auth/presentation/guards/jwt-auth.guard';
import { FollowsPresentationService } from './follows-presentation.service';

@Controller('follows')
@UseGuards(JwtAuthGuard)
export class FollowsController {
  constructor(
    private readonly followsPresentationService: FollowsPresentationService,
  ) {}

  @Post(':followeeId')
  @HttpCode(HttpStatus.NO_CONTENT)
  follow(
    @CurrentUser() user: AuthenticatedUser,
    @Param('followeeId', ParseUUIDPipe) followeeId: string,
  ): Promise<void> {
    return this.followsPresentationService.follow(user.userId, followeeId);
  }

  @Delete(':followeeId')
  @HttpCode(HttpStatus.NO_CONTENT)
  unfollow(
    @CurrentUser() user: AuthenticatedUser,
    @Param('followeeId', ParseUUIDPipe) followeeId: string,
  ): Promise<void> {
    return this.followsPresentationService.unfollow(user.userId, followeeId);
  }
}
