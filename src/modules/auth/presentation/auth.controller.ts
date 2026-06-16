import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthSession } from '../domain/auth-session';
import { AuthPresentationService } from './auth-presentation.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

/**
 * Thin HTTP adapter: bind routes, delegate to the presentation service. No
 * business logic, no data access.
 */
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authPresentationService: AuthPresentationService,
  ) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() dto: SignUpDto): Promise<AuthSession> {
    return this.authPresentationService.signUp(dto);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() dto: SignInDto): Promise<AuthSession> {
    return this.authPresentationService.signIn(dto);
  }
}
