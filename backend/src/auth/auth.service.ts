import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { verifyHash } from '../common/helpers/hash';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    readonly usersService: UsersService,
  ) {}

  private async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validateLoginPassword(username: string, password: string) {
    const user = await this.usersService.findOneForValidate(username);
    const isCorrectPassword = await verifyHash(password, user.password);
    if (user && isCorrectPassword) {
      return this.login(user);
    }
    if (!user) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }
    return null;
  }
}
