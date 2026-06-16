import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * Infrastructure root for persistence.
 *
 * Note that this module only wires the connection. Entities are NOT registered
 * here — each module registers its own entities via
 * `TypeOrmModule.forFeature([...])` inside its `infrastructure/repositories`
 * module, so an entity stays private to the repository that owns it (Part 4:
 * "Infrastructure must not export Entity").
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'fbca'),
        password: config.get<string>('DB_PASSWORD', 'fbca'),
        database: config.get<string>('DB_DATABASE', 'fbca'),
        synchronize: config.get<string>('DB_SYNCHRONIZE', 'false') === 'true',
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
