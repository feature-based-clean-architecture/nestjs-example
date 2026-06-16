import { Injectable } from "@nestjs/common";
import { err, ok, Result } from "neverthrow";
import { UseCaseHandler } from "../../../../lib/use-case/use-case";
import { UserRepository } from "../../infrastructure/repositories/user.repository";
import { GetUserByEmailErrorCode } from "./get-user-by-email.errors";
import {
  GetUserByEmailParams,
  GetUserByEmailResult,
} from "./get-user-by-email.types";

@Injectable()
export class GetUserByEmailHandler
  implements
    UseCaseHandler<
      GetUserByEmailParams,
      Result<GetUserByEmailResult, GetUserByEmailErrorCode>
    >
{
  constructor(private readonly userRepository: UserRepository) {}

  async run(
    params: GetUserByEmailParams,
  ): Promise<Result<GetUserByEmailResult, GetUserByEmailErrorCode>> {
    const findUserResult = await this.userRepository.findByEmail(params.email);
    if (findUserResult.isErr()) {
      return err("GET_USER_BY_EMAIL_PERSISTENCE_ERROR");
    }

    return ok(findUserResult.value);
  }
}
