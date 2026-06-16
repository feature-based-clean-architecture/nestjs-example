import { Injectable } from "@nestjs/common";
import { Result } from "neverthrow";
import { CreateUserData, User } from "../domain/user";
import { CreateUserErrorCode } from "../use-case/create-user/create-user.errors";
import { CreateUserHandler } from "../use-case/create-user/create-user.handler";
import { GetUserByEmailErrorCode } from "../use-case/get-user-by-email/get-user-by-email.errors";
import { GetUserByEmailHandler } from "../use-case/get-user-by-email/get-user-by-email.handler";
import { GetUserByIdErrorCode } from "../use-case/get-user-by-id/get-user-by-id.errors";
import { GetUserByIdHandler } from "../use-case/get-user-by-id/get-user-by-id.handler";

@Injectable()
export class UsersExternalService {
  constructor(
    private readonly createUserHandler: CreateUserHandler,
    private readonly getUserByIdHandler: GetUserByIdHandler,
    private readonly getUserByEmailHandler: GetUserByEmailHandler,
  ) {}

  async createUser(
    data: CreateUserData,
  ): Promise<Result<User, CreateUserErrorCode>> {
    return this.createUserHandler.run(data);
  }

  async getUserByEmail(
    email: string,
  ): Promise<Result<User | undefined, GetUserByEmailErrorCode>> {
    return this.getUserByEmailHandler.run({ email });
  }

  async getUserById(
    id: string,
  ): Promise<Result<User | undefined, GetUserByIdErrorCode>> {
    return this.getUserByIdHandler.run({ id });
  }
}
