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
import { Jwt } from '../../auth/infrastructure/jwt/jwt.decorator';
import { JwtGuard } from '../../auth/presentation/guards/jwt-auth.guard';
import { JwtPayload } from '../../auth/domain/jwt-payload';
import { FollowsPresentationService } from './follows-presentation.service';

@Controller('follows')
@UseGuards(JwtGuard)
export class FollowsController {
  constructor(
    private readonly followsPresentationService: FollowsPresentationService,
  ) {}

  @Post(':followeeId')
  @HttpCode(HttpStatus.NO_CONTENT)
  follow(
    @Jwt() jwt: JwtPayload,
    @Param('followeeId', ParseUUIDPipe) followeeId: string,
  ): Promise<void> {
    return this.followsPresentationService.follow(jwt.userId, followeeId);
  }

  @Delete(':followeeId')
  @HttpCode(HttpStatus.NO_CONTENT)
  unfollow(
    @Jwt() jwt: JwtPayload,
    @Param('followeeId', ParseUUIDPipe) followeeId: string,
  ): Promise<void> {
    return this.followsPresentationService.unfollow(jwt.userId, followeeId);
  }
}
