import { Injectable } from "@nestjs/common";
import { err, fromAsyncThrowable, ok, Result } from "neverthrow";
import { UsersExternalService } from "../../../users/external";
import { HashService } from "src/infrastructure/hash/hash.service";
import { JwtService } from "@nestjs/jwt";
import { SignUpErrorCode } from "./sign-up.errors";
import { UseCaseHandler } from "src/lib/use-case/use-case";
import { JWT_CONFIG } from "../../infrastructure/jwt/jwt.config";
import { SignUpParams, SignUpResult } from "./sign-up.types";

@Injectable()
export class SignUpHandler implements UseCaseHandler<
  SignUpParams,
  Result<SignUpResult, SignUpErrorCode>
> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
    private readonly usersExternalService: UsersExternalService,
  ) {}

  async run(
    params: SignUpParams,
  ): Promise<Result<SignUpResult, SignUpErrorCode>> {
    const getUserByEmailResult = await this.usersExternalService.getUserByEmail(
      params.email,
    );

    if (getUserByEmailResult.isErr()) {
      return err("SIGN_UP_PERSISTENCE_ERROR");
    }
    if (getUserByEmailResult.value) {
      return err("SIGN_UP_EMAIL_ALREADY_EXISTS");
    }

    const hashResult = await this.hashService.hash(params.password);
    if (hashResult.isErr()) {
      return err("SIGN_UP_HASHING_FAILED");
    }

    const createUserResult = await this.usersExternalService.createUser({
      email: params.email,
      passwordHash: hashResult.value,
      displayName: params.displayName,
    });
    if (createUserResult.isErr()) {
      return err("SIGN_UP_PERSISTENCE_ERROR");
    }

    const user = createUserResult.value;

    const signAccessTokenResult = await fromAsyncThrowable(async () =>
      this.jwtService.signAsync(params, {
        secret: JWT_CONFIG.JWT_REFRESH_KEY,
        expiresIn: JWT_CONFIG.JWT_REFRESH_EXP,
        algorithm: "HS256",
      }),
    )();
    if (signAccessTokenResult.isErr()) {
      return err("SIGN_UP_GENERATE_TOKEN_ERROR");
    }

    return ok({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      accessToken: signAccessTokenResult.value,
    });
  }
}
