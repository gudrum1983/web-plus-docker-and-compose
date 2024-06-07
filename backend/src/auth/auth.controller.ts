import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SigninUserDto } from './dto/signin-user.dto';
import { SingnupUserResponseDto } from './dto/singnup-user-response.dto';
import { SigninUserResponseDto } from './dto/singnin-user-response.dto';
import { UserProfileResponseDto } from '../users/dto/user-profile-response.dto';

@ApiTags('Auth')
@Controller('')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @ApiOkResponse({
    description: 'Вход выполнен успешно',
    type: SigninUserResponseDto,
  })
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(
    @Body() authSigninDto: SigninUserDto,
  ): Promise<SigninUserResponseDto> {
    const { username, password } = authSigninDto;
    return await this.authService.validateLoginPassword(username, password);
  }

  @ApiOkResponse({
    description: 'Создание нового пользователя прошло успешно',
    type: SingnupUserResponseDto,
  })
  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserProfileResponseDto> {
    return await this.usersService.signup(createUserDto);
  }
}
