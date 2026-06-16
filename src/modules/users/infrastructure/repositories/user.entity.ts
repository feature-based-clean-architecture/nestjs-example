import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * ORM entity — an infrastructure detail.
 *
 * FBCA rule (Part 4): the entity is PRIVATE to its repository. It is never
 * exported from the module, never returned from a use-case, never seen by
 * presentation. The repository maps it to/from the `User` domain model.
 */
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 320 })
  email: string;

  @Column({ type: 'varchar', name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'varchar', name: 'display_name', length: 80 })
  displayName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
