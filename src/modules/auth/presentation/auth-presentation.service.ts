import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { SignInHandler } from "../use-case/sign-in/sign-in.handler";
import { SignUpHandler } from "../use-case/sign-up/sign-up.handler";
import { SignInDtoReq, SignInDtoRes } from "./dto/sign-in.dto";
import { SignUpDtoReq, SignUpDtoRes } from "./dto/sign-up.dto";

@Injectable()
export class AuthPresentationService {
  constructor(
    private readonly signUpHandler: SignUpHandler,
    private readonly signInHandler: SignInHandler,
  ) {}

  async signUp(dto: SignUpDtoReq): Promise<SignUpDtoRes> {
    const signUpHandlerResult = await this.signUpHandler.run({
      email: dto.email,
      password: dto.password,
      displayName: dto.displayName,
    });

    if (signUpHandlerResult.isErr()) {
      if (signUpHandlerResult.error === "SIGN_UP_EMAIL_ALREADY_EXISTS") {
        throw new ConflictException("Email is already registered");
      }

      throw new InternalServerErrorException();
    }

    return signUpHandlerResult.value;
  }

  async signIn(dto: SignInDtoReq): Promise<SignInDtoRes> {
    const signInHandlerResult = await this.signInHandler.run({
      email: dto.email,
      password: dto.password,
    });

    if (signInHandlerResult.isErr()) {
      if (signInHandlerResult.error === "SIGN_IN_INVALID_CREDENTIALS") {
        throw new UnauthorizedException("Invalid email or password");
      }

      throw new InternalServerErrorException();
    }

    return signInHandlerResult.value;
  }
}
