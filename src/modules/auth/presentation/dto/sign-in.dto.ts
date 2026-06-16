import { IsEmail, IsString } from "class-validator";
import {
  SignInParams,
  SignInResult,
} from "../../use-case/sign-in/sign-in.types";

export class SignInDtoReq implements SignInParams {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class SignInDtoRes implements SignInResult {
  id: string;
  email: string;
  displayName: string;
  accessToken: string;
}
