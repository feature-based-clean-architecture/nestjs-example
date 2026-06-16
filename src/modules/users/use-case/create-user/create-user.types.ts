import { User } from "../../domain/user";

export type CreateUserParams = {
  email: string;
  passwordHash: string;
  displayName: string;
};

export type CreateUserResult = User;
