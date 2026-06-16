import { User } from "../../domain/user";

export type GetUserByIdParams = {
  id: string;
};

export type GetUserByIdResult = User | undefined;
