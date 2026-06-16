import { Injectable } from "@nestjs/common";
import { err, ok, Result } from "neverthrow";
import { UseCaseHandler } from "../../../../lib/use-case/use-case";
import { UserRepository } from "../../infrastructure/repositories/user.repository";
import { GetUserByIdErrorCode } from "./get-user-by-id.errors";
import { GetUserByIdParams, GetUserByIdResult } from "./get-user-by-id.types";

@Injectable()
export class GetUserByIdHandler
  implements
    UseCaseHandler<
      GetUserByIdParams,
      Result<GetUserByIdResult, GetUserByIdErrorCode>
    >
{
  constructor(private readonly userRepository: UserRepository) {}

  async run(
    params: GetUserByIdParams,
  ): Promise<Result<GetUserByIdResult, GetUserByIdErrorCode>> {
    const findUserResult = await this.userRepository.findById(params.id);
    if (findUserResult.isErr()) {
      return err("GET_USER_BY_ID_PERSISTENCE_ERROR");
    }

    return ok(findUserResult.value);
  }
}
