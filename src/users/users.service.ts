import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'jsonwebtoken';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { User } from './users.entity';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signupUser(createUserDTO: CreateUserDTO): Promise<void> {
    return this.userRepository.signupUser(createUserDTO);
  }

  async login(loginUserDTO: LoginUserDTO): Promise<{ token: string }> {
    const email = await this.userRepository.validateUser(loginUserDTO);
    if (!email) throw new UnauthorizedException('User does not exist');

    const payload: JwtPayload = { email };
    const token = this.jwtService.sign(payload);

    return { token };
  }
}
