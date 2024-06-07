import { OmitType } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export class SingnupUserResponseDto extends OmitType(User, [
  'password',
  'offers',
  'wishes',
  'wishlists',
] as const) {}
