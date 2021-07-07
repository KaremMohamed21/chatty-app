import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  async signupUser(@Body() createUserDTO: CreateUserDTO): Promise<void> {
    return this.userService.signupUser(createUserDTO);
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Body() loginUserDTO: LoginUserDTO): Promise<{ token: string }> {
    return this.userService.login(loginUserDTO);
  }
}
