import { ApiProperty } from '@nestjs/swagger';

export class SigninUserResponseDto {
  @ApiProperty()
  access_token: string;
}
