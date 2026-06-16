import { CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';

/**
 * Private ORM entity for the follow edge. Composite primary key
 * (follower, followee) makes a duplicate follow a unique-violation at the DB
 * level.
 */
@Entity('follows')
@Index(['followeeId'])
export class FollowEntity {
  @PrimaryColumn({ type: 'uuid', name: 'follower_id' })
  followerId: string;

  @PrimaryColumn({ type: 'uuid', name: 'followee_id' })
  followeeId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
