import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthPresentationModule } from './modules/auth/presentation/auth-presentation.module';
import { FollowsPresentationModule } from './modules/follows/presentation/follows-presentation.module';
import { UsersPresentationModule } from './modules/users/presentation/users-presentation.module';
import { DatabaseModule } from './shared/database/database.module';

/**
 * The composition root only wires the OUTERMOST layer of each feature — its
 * presentation module. Everything else (use-cases, external ports,
 * infrastructure) is pulled in transitively. The app never reaches into a
 * module's internals.
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersPresentationModule,
    AuthPresentationModule,
    FollowsPresentationModule,
  ],
})
export class AppModule {}
