import { PickType } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export class SigninUserDto extends PickType(User, [
  'username',
  'password',
] as const) {}
