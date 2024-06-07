import { OmitType } from '@nestjs/swagger';
import { UserProfileResponseDto } from './user-profile-response.dto';

export class UserPublicProfileResponseDto extends OmitType(
  UserProfileResponseDto,
  ['email'] as const,
) {}
