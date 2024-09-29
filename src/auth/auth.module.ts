import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { env } from 'process';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../../src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { KnowledgeBaseModule } from '../../src/knowledge-base/knowledge-base.module';

export const jwtSecret = env.JWT_SECRET;

@Module({
  imports: [
    PassportModule,
    UsersModule,
    KnowledgeBaseModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
