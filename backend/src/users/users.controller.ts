import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AuthUser } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-user.dto';
import { UserWishesDto } from './dto/user-wishes.dto';
import { Wish } from '../wishes/entities/wish.entity';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';

@ApiTags('Users')
@ApiExtraModels(User)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ type: UserProfileResponseDto })
  @Patch('me')
  updateMe(
    @AuthUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    return this.usersService.updateOne(user, updateUserDto);
  }

  @ApiOkResponse({ type: UserProfileResponseDto })
  @Get('me')
  findOwn(@AuthUser() user: User): UserProfileResponseDto {
    return this.usersService.instanceUserToPlain(user);
  }

  @ApiOkResponse({ type: Array<Wish> })
  @Get('me/wishes')
  getOwnWishes(@AuthUser() user: User): Promise<Array<Wish>> {
    return this.usersService.getOwnWishes(Number(user.id));
  }

  @ApiOkResponse({ type: UserProfileResponseDto, isArray: true })
  @Post('find')
  findMany(@Body() body: FindUsersDto): Promise<Array<UserProfileResponseDto>> {
    return this.usersService.findByMailOrName(body);
  }

  @ApiOkResponse({ type: UserPublicProfileResponseDto })
  @Get(':username')
  findOne(
    @Param('username') username: string,
  ): Promise<UserPublicProfileResponseDto> {
    return this.usersService.findByUsername(username);
  }

  @ApiOkResponse({ type: Array<UserWishesDto> })
  @Get(':username/wishes')
  getWishes(
    @Param('username') username: string,
  ): Promise<Array<UserWishesDto>> {
    return this.usersService.getWishes(username);
  }
}
