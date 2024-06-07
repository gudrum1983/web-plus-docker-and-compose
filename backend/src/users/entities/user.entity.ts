import { Column, Entity, OneToMany } from 'typeorm';
import { Wish } from '../../wishes/entities/wish.entity';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';
import {
  defaultAvatar,
  textAbout,
  userNameLengthMax,
  userNameAndAboutLengthMin,
  userAboutLengthMax,
} from '../../../utils/constants';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { BaseEntityWithIdAndTime } from '../../baseEntity/entities/BaseEntityWithIdAndTime.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends BaseEntityWithIdAndTime {
  @ApiProperty({ description: 'Имя пользователя', example: 'Александр' })
  @IsString()
  @Length(userNameAndAboutLengthMin, userNameLengthMax)
  @Column({ unique: true })
  username: string;

  @ApiPropertyOptional({
    description: 'Описание пользователя',
    example: 'Мой дядя самых честных правил',
  })
  @MaxLength(userAboutLengthMax)
  @IsOptional()
  @Column({ default: textAbout })
  about: string;

  @ApiPropertyOptional({
    description: 'Аватар пользователя',
    example: defaultAvatar,
  })
  @IsUrl()
  @IsOptional()
  @Column({ default: defaultAvatar })
  avatar: string;

  @ApiProperty({
    description: 'Почта пользователя',
    example: 'post@mail.com',
    uniqueItems: true,
  })
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Exclude({ toClassOnly: false, toPlainOnly: true })
  @Column({ select: false })
  @ApiProperty({ description: 'Пароль пользователя', example: '123456789' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ type: () => Wish, isArray: true })
  @OneToMany(() => Wish, (wishes) => wishes.owner)
  wishes: Wish[];

  @ApiProperty({ type: () => Offer, isArray: true })
  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @ApiProperty({ type: () => Wishlist, isArray: true })
  @OneToMany(() => Wishlist, (wishlists) => wishlists.owner)
  wishlists: Wishlist[];
}
