/**
 * Domain model — pure data, no framework, no ORM, no HTTP.
 *
 * `passwordHash` lives in the domain because "a user has credentials" is a
 * business fact. It is the infrastructure layer's job to persist it and the
 * presentation layer's job to never leak it.
 */
export type User = {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  createdAt: Date;
};

/** Data required to bring a new user into existence. */
export type CreateUserData = {
  email: string;
  passwordHash: string;
  displayName: string;
};
