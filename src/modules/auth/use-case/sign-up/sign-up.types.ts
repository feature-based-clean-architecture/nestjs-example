export type SignUpParams = {
  email: string;
  password: string;
  displayName: string;
};

export type SignUpResult = {
  id: string;
  email: string;
  displayName: string;
  accessToken: string;
};
