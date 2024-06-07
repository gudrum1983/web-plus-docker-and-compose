import { ApiProperty, PickType } from '@nestjs/swagger';
import { Offer } from '../entities/offer.entity';
import { Column } from 'typeorm';
import { IsNumber } from 'class-validator';

export class CreateOfferDto extends PickType(Offer, [
  'amount',
  'hidden',
] as const) {
  @ApiProperty({
    description: 'ID подарка',
    example: 5,
  })
  @IsNumber()
  @Column()
  itemId: number;
}
