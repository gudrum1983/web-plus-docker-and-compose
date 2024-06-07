import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Wish } from './entities/wish.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../common/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { DeleteResult } from 'typeorm';

@ApiTags('Wishes')
@ApiBearerAuth()
@ApiExtraModels(Wish)
@UseGuards(JwtAuthGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @ApiOkResponse({ type: Wish })
  @Post()
  async create(
    @AuthUser() user: User,
    @Body() createWishDto: CreateWishDto,
  ): Promise<Wish> {
    return await this.wishesService.create(user, createWishDto);
  }

  @ApiOkResponse({ type: Array<Wish> })
  @Get('last')
  findLast(): Promise<Array<Wish>> {
    return this.wishesService.findLast();
  }

  @ApiOkResponse({ type: Array<Wish> })
  @Get('top')
  findTop(): Promise<Array<Wish>> {
    return this.wishesService.findTop();
  }

  @ApiOkResponse({ type: Wish })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Wish> {
    return this.wishesService.findOneById(Number(id));
  }

  @ApiOkResponse({ type: Wish })
  @Patch(':id')
  update(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    return this.wishesService.update(Number(id), user.id, updateWishDto);
  }

  @ApiOkResponse({ type: null })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<DeleteResult> {
    return this.wishesService.deleteOne({
      wishId: Number(id),
      userId: user.id,
    });
  }

  @ApiOkResponse({ type: Wish })
  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  copy(@AuthUser() user: User, @Param('id') id: string): Promise<Wish> {
    return this.wishesService.copyOne({
      wishId: Number(id),
      user,
    });
  }
}
