import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUser } from '../common/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Offer } from './entities/offer.entity';

@ApiTags('Offer')
@ApiExtraModels(Offer)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @ApiOkResponse({ type: Offer })
  @Post()
  create(
    @AuthUser() user: User,
    @Body() createOfferDto: CreateOfferDto,
  ): Promise<Offer> {
    return this.offersService.create(user, createOfferDto);
  }

  @ApiOkResponse({ type: Array<Offer> })
  @Get()
  findAll(): Promise<Array<Offer>> {
    return this.offersService.findAll();
  }

  @ApiOkResponse({ type: Array<Offer> })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Array<Offer>> {
    return this.offersService.findOne(Number(id));
  }
}
