import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserPublicProfileResponseDto } from '../users/dto/user-public-profile-response.dto';
import { Wishlist } from './entities/wishlist.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../common/decorators/user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Wishlists')
@ApiExtraModels(Wishlist)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @ApiOkResponse({ type: Wishlist, isArray: true })
  @Get()
  findAll(): Promise<Array<Wishlist>> {
    return this.wishlistsService.findAll();
  }

  @ApiOkResponse({ type: Wishlist })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @AuthUser() user: User,
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    return this.wishlistsService.create(user, createWishlistDto);
  }

  @ApiOkResponse({ type: UserPublicProfileResponseDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistsService.findOne(Number(id));
  }

  @ApiOkResponse({ type: UserPublicProfileResponseDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @AuthUser() user: User,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.update(Number(id), updateWishlistDto, user.id);
  }

  @ApiOkResponse({ type: UserPublicProfileResponseDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@AuthUser() user: User, @Param('id') id: string) {
    return this.wishlistsService.remove(Number(id), user.id);
  }
}
