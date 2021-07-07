import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './users.repository';
import { JwtModule } from '@nestjs/jwt';
import { get } from 'config';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    JwtModule.register({
      secret: get('jwt.secret'),
      signOptions: {
        expiresIn: get('jwt.expiresIn'),
      },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
