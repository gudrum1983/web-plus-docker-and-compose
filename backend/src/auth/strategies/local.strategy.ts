import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    const accessToken = await this.authService.validateLoginPassword(
      username,
      password,
    );

    if (!accessToken) {
      throw new UnauthorizedException('Неправильное имя или пароль');
    }

    return accessToken;
  }
}
