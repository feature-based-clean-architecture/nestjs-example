import { Injectable } from "@nestjs/common";
import { err, ok, Result } from "neverthrow";
import { UseCaseHandler } from "../../../../lib/use-case/use-case";
import { UserRepository } from "../../infrastructure/repositories/user.repository";
import { CreateUserErrorCode } from "./create-user.errors";
import { CreateUserParams, CreateUserResult } from "./create-user.types";

@Injectable()
export class CreateUserHandler
  implements
    UseCaseHandler<CreateUserParams, Result<CreateUserResult, CreateUserErrorCode>>
{
  constructor(private readonly userRepository: UserRepository) {}

  async run(
    params: CreateUserParams,
  ): Promise<Result<CreateUserResult, CreateUserErrorCode>> {
    const createUserResult = await this.userRepository.create(params);
    if (createUserResult.isErr()) {
      if (createUserResult.error === "EMAIL_ALREADY_EXISTS") {
        return err("CREATE_USER_EMAIL_ALREADY_EXISTS");
      }
      return err("CREATE_USER_PERSISTENCE_ERROR");
    }

    return ok(createUserResult.value);
  }
}
