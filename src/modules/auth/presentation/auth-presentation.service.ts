import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthSession } from '../domain/auth-session';
import { SignInHandler } from '../use-case/sign-in/sign-in.handler';
import { SignUpHandler } from '../use-case/sign-up/sign-up.handler';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

/**
 * The ONLY place in the auth module that knows about HTTP status codes.
 * It translates the use-case's typed error codes into HTTP exceptions
 * (Part 4: "Use-case must not know HTTP statuses").
 */
@Injectable()
export class AuthPresentationService {
  constructor(
    private readonly signUpHandler: SignUpHandler,
    private readonly signInHandler: SignInHandler,
  ) {}

  async signUp(dto: SignUpDto): Promise<AuthSession> {
    const result = await this.signUpHandler.run(
      dto.email,
      dto.password,
      dto.displayName,
    );

    if (result.isErr()) {
      switch (result.error) {
        case 'EMAIL_ALREADY_EXISTS':
          throw new ConflictException('Email is already registered');
        default:
          throw new InternalServerErrorException();
      }
    }

    return result.value;
  }

  async signIn(dto: SignInDto): Promise<AuthSession> {
    const result = await this.signInHandler.run(dto.email, dto.password);

    if (result.isErr()) {
      switch (result.error) {
        case 'INVALID_CREDENTIALS':
          throw new UnauthorizedException('Invalid email or password');
        default:
          throw new InternalServerErrorException();
      }
    }

    return result.value;
  }
}
