import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthPresentationService } from "./auth-presentation.service";
import { SignInDtoReq, SignInDtoRes } from "./dto/sign-in.dto";
import { SignUpDtoReq, SignUpDtoRes } from "./dto/sign-up.dto";

@Controller("auth")
export class AuthPresentationController {
  constructor(
    private readonly authPresentationService: AuthPresentationService,
  ) {}

  @Post("sign-up")
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() dto: SignUpDtoReq): Promise<SignUpDtoRes> {
    return this.authPresentationService.signUp(dto);
  }

  @Post("sign-in")
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: SignInDtoReq): Promise<SignInDtoRes> {
    return this.authPresentationService.signIn(dto);
  }
}
