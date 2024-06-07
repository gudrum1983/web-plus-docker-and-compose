import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Offer } from '../../offers/entities/offer.entity';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { BaseEntityWithIdAndTime } from '../../baseEntity/entities/BaseEntityWithIdAndTime.entity';
import { wishNameLengthMax, wishNameLengthMin } from '../../../utils/constants';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class Wish extends BaseEntityWithIdAndTime {
  @ApiProperty({
    description: 'Наименование подарка',
  })
  @IsString()
  @Column()
  @Length(wishNameLengthMin, wishNameLengthMax)
  name: string;

  @ApiProperty({
    description: 'Изображение подарка',
  })
  @IsNotEmpty()
  @Column()
  @IsUrl()
  image: string;

  @ApiProperty({
    description: 'Ссылка на магазин и подарок',
    example: 'https://market.yandex.ru/cc/PxU1mub',
  })
  @IsNotEmpty()
  @Column()
  @IsUrl()
  link: string;

  @ApiProperty({
    description: 'Стоимость подарка',
    example: 1500,
  })
  @Column()
  @IsNotEmpty()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  price: number;

  @ApiProperty({
    description: 'Сумма донатов',
    example: 0,
  })
  @Column({ default: 0 })
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  raised: number;

  @ApiProperty({
    description: 'Описание подарка',
    example: 'Самая нужная вещь на свете',
  })
  @IsString()
  @MaxLength(1024)
  @Column()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Счетчик копирования',
    example: 0,
  })
  @Column({ default: 0 })
  @IsNumber()
  copied: number;

  @ApiProperty({
    description: 'Список спонсоров',
    type: () => Offer,
    isArray: true,
  })
  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ApiProperty({ type: () => User, description: 'Владелец' })
  @ManyToOne(() => User, (owner) => owner.wishes)
  owner: User;

  @ManyToMany(() => Wishlist)
  Wishlists: Wishlist[];
}
