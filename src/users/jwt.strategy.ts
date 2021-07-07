import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { get } from 'config';
import { JwtPayload } from 'jsonwebtoken';
import { UserRepository } from './users.repository';
import { UnauthorizedException } from '@nestjs/common';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: get('jwt.secret'),
    });
  }

  async validate(jwtPayload: JwtPayload) {
    const { email } = jwtPayload;
    const user = this.userRepository.findOne({ email });

    if (!user) throw new UnauthorizedException('Forbidden');

    return user;
  }
}
