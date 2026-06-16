/**
 * The public shape of a user profile. Note: no `passwordHash`. Presentation
 * decides what leaves the system.
 */
export type UserProfileResponse = {
  id: string;
  email: string;
  displayName: string;
  createdAt: Date;
  followers: number;
  following: number;
};
