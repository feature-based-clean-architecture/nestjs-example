import { User } from "../../domain/user";

export type GetUserByEmailParams = {
  email: string;
};

export type GetUserByEmailResult = User | undefined;
