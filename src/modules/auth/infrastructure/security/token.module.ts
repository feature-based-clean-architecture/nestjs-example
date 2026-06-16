import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';

/**
 * Encapsulates JWT configuration. The signing secret/expiry are an
 * infrastructure concern and stay hidden behind `TokenService`.
 */
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'dev-only-change-me'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '1h'),
        },
      }),
    }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
