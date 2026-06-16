import { Injectable } from "@nestjs/common";
import { err, fromAsyncThrowable, ok, Result } from "neverthrow";
import { UsersExternalService } from "../../../users/external";
import { UseCaseHandler } from "src/lib/use-case/use-case";
import { SignInErrorErrorCode } from "./sign-in.errors";
import { HashService } from "src/infrastructure/hash/hash.service";
import { JwtService } from "@nestjs/jwt";
import { JWT_CONFIG } from "../../infrastructure/jwt/jwt.config";
import { SignInParams, SignInResult } from "./sign-in.types";

@Injectable()
export class SignInHandler implements UseCaseHandler<
  SignInParams,
  Result<SignInResult, SignInErrorErrorCode>
> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
    private readonly usersExternalService: UsersExternalService,
  ) {}

  async run(
    params: SignInParams,
  ): Promise<Result<SignInResult, SignInErrorErrorCode>> {
    const getUserByEmailResult = await this.usersExternalService.getUserByEmail(
      params.email,
    );
    if (getUserByEmailResult.isErr()) {
      return err("SIGN_IN_PERSISTENCE_ERROR");
    }

    const user = getUserByEmailResult.value;
    if (!user) {
      return err("SIGN_IN_USER_NOT_FOUND");
    }

    const verifyResult = await this.hashService.verify(
      params.password,
      user.passwordHash,
    );
    if (verifyResult.isErr()) {
      return err("SIGN_IN_HASH_ERROR");
    }

    if (!verifyResult.value) {
      return err("SIGN_IN_INVALID_PASSWORD");
    }

    const signAccessTokenResult = await fromAsyncThrowable(async () =>
      this.jwtService.signAsync(params, {
        secret: JWT_CONFIG.JWT_REFRESH_KEY,
        expiresIn: JWT_CONFIG.JWT_REFRESH_EXP,
        algorithm: "HS256",
      }),
    )();
    if (signAccessTokenResult.isErr()) {
      return err("SIGN_IN_GENERATE_TOKEN_ERROR");
    }

    return ok({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      accessToken: signAccessTokenResult.value,
    });
  }
}
