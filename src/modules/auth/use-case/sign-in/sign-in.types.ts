export type SignInParams = {
  email: string;
  password: string;
};

export type SignInResult = {
  id: string;
  email: string;
  displayName: string;
  accessToken: string;
};
