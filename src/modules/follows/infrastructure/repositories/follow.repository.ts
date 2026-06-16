import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { err, ok, Result } from 'neverthrow';
import { QueryFailedError, Repository } from 'typeorm';
import { Follow, FollowCounts } from '../../domain/follow';
import { FollowEntity } from './follow.entity';

const PG_UNIQUE_VIOLATION = '23505';

export type CreateFollowError = 'ALREADY_FOLLOWING' | 'PERSISTENCE_ERROR';

@Injectable()
export class FollowRepository {
  constructor(
    @InjectRepository(FollowEntity)
    private readonly follows: Repository<FollowEntity>,
  ) {}

  async create(
    followerId: string,
    followeeId: string,
  ): Promise<Result<Follow, CreateFollowError>> {
    try {
      const entity = this.follows.create({ followerId, followeeId });
      const saved = await this.follows.save(entity);
      return ok(this.toDomain(saved));
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as unknown as { code?: string }).code === PG_UNIQUE_VIOLATION
      ) {
        return err('ALREADY_FOLLOWING');
      }
      return err('PERSISTENCE_ERROR');
    }
  }

  /** Returns whether an edge actually existed and was removed. */
  async delete(
    followerId: string,
    followeeId: string,
  ): Promise<Result<boolean, 'PERSISTENCE_ERROR'>> {
    try {
      const result = await this.follows.delete({ followerId, followeeId });
      return ok((result.affected ?? 0) > 0);
    } catch {
      return err('PERSISTENCE_ERROR');
    }
  }

  async getCounts(
    userId: string,
  ): Promise<Result<FollowCounts, 'PERSISTENCE_ERROR'>> {
    try {
      const [followers, following] = await Promise.all([
        this.follows.countBy({ followeeId: userId }),
        this.follows.countBy({ followerId: userId }),
      ]);
      return ok({ followers, following });
    } catch {
      return err('PERSISTENCE_ERROR');
    }
  }

  private toDomain(entity: FollowEntity): Follow {
    return {
      followerId: entity.followerId,
      followeeId: entity.followeeId,
      createdAt: entity.createdAt,
    };
  }
}
