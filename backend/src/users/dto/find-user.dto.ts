import { ApiProperty } from '@nestjs/swagger';

export class FindUsersDto {
  @ApiProperty({
    description: 'username или email',
    example: 'user@email.com',
  })
  query: string;
}
