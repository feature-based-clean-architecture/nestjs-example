export type User = {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  createdAt: Date;
};

export type CreateUserData = {
  email: string;
  passwordHash: string;
  displayName: string;
};
