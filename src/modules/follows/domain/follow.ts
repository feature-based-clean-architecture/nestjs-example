/**
 * A directed "follower follows followee" edge. Pure domain.
 */
export type Follow = {
  followerId: string;
  followeeId: string;
  createdAt: Date;
};

export type FollowCounts = {
  followers: number;
  following: number;
};
