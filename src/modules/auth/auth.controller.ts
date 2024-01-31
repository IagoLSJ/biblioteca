import { Controller, Post, Body} from '@nestjs/common';

import { AuthService } from './auth.service';

import { SignInDTO } from './dto/signIn.dto';
import { SignUpDTO } from './dto/singUp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signIn')
  async signIn(@Body() signIn: SignInDTO) {
    return this.authService.signIn(signIn);
  }

  @Post('/signUp')
  async signUp(@Body() signUp: SignUpDTO) {
    return this.authService.signUp(signUp);
  }
}
