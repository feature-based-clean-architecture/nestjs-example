import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";
import {
  SignUpParams,
  SignUpResult,
} from "../../use-case/sign-up/sign-up.types";

export class SignUpDtoReq implements SignUpParams {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(256)
  password: string;

  @IsString()
  @MinLength(1)
  @MaxLength(80)
  displayName: string;
}

export class SignUpDtoRes implements SignUpResult {
  id: string;
  email: string;
  displayName: string;
  accessToken: string;
}
