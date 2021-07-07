import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './users.entity';
import { hash } from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { LoginUserDTO } from './dto/login-user.dto';
import console from 'console';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signupUser(createUserDTO: CreateUserDTO): Promise<void> {
    const { firstName, lastName, email, password } = createUserDTO;

    const user = new User();
    user.firstname = firstName;
    user.lastname = lastName;
    user.email = email;
    user.password = await this.hashPassword(password);

    try {
      await user.save();
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('username already exists');
      } else {
        throw new InternalServerErrorException('hi');
      }
    }
  }

  async validateUser(loginUserDTO: LoginUserDTO): Promise<string> {
    try {
      const { email, password } = loginUserDTO;

      const user = await this.findOne({ email });

      if (!user || !user.comparePassword(password)) {
        return null;
      }

      return email;
    } catch (err) {
      console.log(err);
    }
  }

  async hashPassword(password: string): Promise<string> {
    return await hash(password, 12);
  }
}
