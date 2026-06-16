/**
 * What a successful authentication produces. Pure data — no token library,
 * no HTTP. The presentation layer decides how to deliver the token (body,
 * cookie, header).
 */
export type AuthSession = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    displayName: string;
  };
};
