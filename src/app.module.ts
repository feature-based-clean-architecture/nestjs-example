import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthPresentationModule } from './modules/auth/presentation/auth-presentation.module';
import { FollowsPresentationModule } from './modules/follows/presentation/follows-presentation.module';
import { UsersPresentationModule } from './modules/users/presentation/users-presentation.module';
import { DatabaseModule } from './infrastructure/database/database.module';

/**
 * The composition root only wires the OUTERMOST layer of each feature — its
 * presentation module. Everything else (use-cases, external ports,
 * infrastructure) is pulled in transitively.
 *
 * JwtModule is registered globally here: the use-cases and the guard inject
 * `JwtService` directly and pass the secret/expiry per call (from JWT_CONFIG),
 * so a single global registration is enough.
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({ global: true }),
    DatabaseModule,
    UsersPresentationModule,
    AuthPresentationModule,
    FollowsPresentationModule,
  ],
})
export class AppModule {}
